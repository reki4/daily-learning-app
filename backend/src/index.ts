import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

// Health check
app.get('/', (c) => {
  return c.json({ message: 'Daily Learning API' })
})

// Categories
app.get('/api/categories', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM categories').all()
  return c.json(results)
})

app.post('/api/categories', async (c) => {
  const { name, icon, color } = await c.req.json()
  const result = await c.env.DB.prepare(
    'INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)'
  ).bind(name, icon, color).run()
  return c.json({ id: result.meta.last_row_id, name, icon, color })
})

// Tags
app.get('/api/tags', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM tags').all()
  return c.json(results)
})

app.post('/api/tags', async (c) => {
  const { name } = await c.req.json()
  const result = await c.env.DB.prepare(
    'INSERT INTO tags (name) VALUES (?)'
  ).bind(name).run()
  return c.json({ id: result.meta.last_row_id, name })
})

// Tasks (master)
app.get('/api/tasks', async (c) => {
  const categoryId = c.req.query('category_id')
  let query = `
    SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color
    FROM tasks t
    LEFT JOIN categories c ON t.category_id = c.id
  `
  if (categoryId) {
    query += ' WHERE t.category_id = ?'
    const { results } = await c.env.DB.prepare(query).bind(categoryId).all()
    return c.json(results)
  }
  const { results } = await c.env.DB.prepare(query).all()
  return c.json(results)
})

app.post('/api/tasks', async (c) => {
  const { category_id, title, description } = await c.req.json()
  const result = await c.env.DB.prepare(
    'INSERT INTO tasks (category_id, title, description, created_at) VALUES (?, ?, ?, datetime("now"))'
  ).bind(category_id, title, description).run()
  return c.json({ id: result.meta.last_row_id, category_id, title, description })
})

app.put('/api/tasks/:id', async (c) => {
  const id = c.req.param('id')
  const { category_id, title, description } = await c.req.json()
  await c.env.DB.prepare(
    'UPDATE tasks SET category_id = ?, title = ?, description = ? WHERE id = ?'
  ).bind(category_id, title, description, id).run()
  return c.json({ id, category_id, title, description })
})

app.delete('/api/tasks/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run()
  return c.json({ success: true })
})

// Task Tags
app.get('/api/tasks/:id/tags', async (c) => {
  const taskId = c.req.param('id')
  const { results } = await c.env.DB.prepare(`
    SELECT t.* FROM tags t
    JOIN task_tags tt ON t.id = tt.tag_id
    WHERE tt.task_id = ?
  `).bind(taskId).all()
  return c.json(results)
})

app.post('/api/tasks/:id/tags', async (c) => {
  const taskId = c.req.param('id')
  const { tag_id } = await c.req.json()
  await c.env.DB.prepare(
    'INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)'
  ).bind(taskId, tag_id).run()
  return c.json({ success: true })
})

// Daily Tasks
app.get('/api/daily-tasks', async (c) => {
  const date = c.req.query('date') || new Date().toISOString().split('T')[0]
  const { results } = await c.env.DB.prepare(`
    SELECT dt.*, t.title, t.description, c.name as category_name, c.icon as category_icon, c.color as category_color
    FROM daily_tasks dt
    JOIN tasks t ON dt.task_id = t.id
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE dt.date = ?
    ORDER BY dt.is_starred DESC, dt.is_completed ASC
  `).bind(date).all()
  return c.json(results)
})

// Generate daily tasks (algorithm)
app.post('/api/daily-tasks/generate', async (c) => {
  const { date, category_ids, count } = await c.req.json()

  // Get random tasks from selected categories
  let query = `
    SELECT id FROM tasks
    WHERE category_id IN (${category_ids.map(() => '?').join(',')})
    ORDER BY RANDOM()
    LIMIT ?
  `
  const { results: tasks } = await c.env.DB.prepare(query)
    .bind(...category_ids, count)
    .all()

  // Insert daily tasks
  for (const task of tasks as { id: number }[]) {
    await c.env.DB.prepare(`
      INSERT INTO daily_tasks (task_id, date, is_completed, is_starred)
      VALUES (?, ?, 0, 0)
    `).bind(task.id, date).run()
  }

  return c.json({ success: true, count: tasks.length })
})

// Update daily task (complete, star, memo)
app.put('/api/daily-tasks/:id', async (c) => {
  const id = c.req.param('id')
  const { is_completed, is_starred, memo } = await c.req.json()

  const updates: string[] = []
  const values: (number | string | null)[] = []

  if (is_completed !== undefined) {
    updates.push('is_completed = ?')
    values.push(is_completed ? 1 : 0)
    if (is_completed) {
      updates.push('completed_at = datetime("now")')
    }
  }
  if (is_starred !== undefined) {
    updates.push('is_starred = ?')
    values.push(is_starred ? 1 : 0)
  }
  if (memo !== undefined) {
    updates.push('memo = ?')
    values.push(memo)
  }

  values.push(id)

  await c.env.DB.prepare(
    `UPDATE daily_tasks SET ${updates.join(', ')} WHERE id = ?`
  ).bind(...values).run()

  return c.json({ success: true })
})

// Statistics
app.get('/api/stats', async (c) => {
  const today = new Date().toISOString().split('T')[0]

  // Total completed
  const { results: totalCompleted } = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM daily_tasks WHERE is_completed = 1'
  ).all()

  // This week completed
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekAgoStr = weekAgo.toISOString().split('T')[0]

  const { results: weeklyCompleted } = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM daily_tasks WHERE is_completed = 1 AND date >= ?'
  ).bind(weekAgoStr).all()

  // Streak calculation
  const { results: streakData } = await c.env.DB.prepare(`
    SELECT DISTINCT date FROM daily_tasks
    WHERE is_completed = 1
    ORDER BY date DESC
  `).all()

  let streak = 0
  const dates = (streakData as { date: string }[]).map(d => d.date)
  const checkDate = new Date(today)

  for (let i = 0; i < dates.length; i++) {
    const expectedDate = checkDate.toISOString().split('T')[0]
    if (dates.includes(expectedDate)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else if (i === 0 && expectedDate === today) {
      // Today not completed yet, check from yesterday
      checkDate.setDate(checkDate.getDate() - 1)
      i--
    } else {
      break
    }
  }

  // Category stats
  const { results: categoryStats } = await c.env.DB.prepare(`
    SELECT c.name, c.color, COUNT(dt.id) as completed_count
    FROM daily_tasks dt
    JOIN tasks t ON dt.task_id = t.id
    JOIN categories c ON t.category_id = c.id
    WHERE dt.is_completed = 1
    GROUP BY c.id
  `).all()

  return c.json({
    total_completed: (totalCompleted[0] as { count: number }).count,
    weekly_completed: (weeklyCompleted[0] as { count: number }).count,
    streak,
    category_stats: categoryStats
  })
})

// Search
app.get('/api/search', async (c) => {
  const query = c.req.query('q') || ''
  const { results } = await c.env.DB.prepare(`
    SELECT dt.*, t.title, t.description, c.name as category_name
    FROM daily_tasks dt
    JOIN tasks t ON dt.task_id = t.id
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.title LIKE ? OR t.description LIKE ? OR dt.memo LIKE ?
    ORDER BY dt.date DESC
    LIMIT 50
  `).bind(`%${query}%`, `%${query}%`, `%${query}%`).all()

  return c.json(results)
})

export default app
