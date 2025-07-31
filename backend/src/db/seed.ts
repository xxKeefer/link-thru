import { db } from './index'
import { roles, permissions, rolePermissions } from './schema'
import { eq } from 'drizzle-orm'

const ROLES = ['admin', 'user']
const roleValues = ROLES.map((role) => ({ name: role }))
const RESOURCES = ['link', 'user']
const ACTIONS = ['create', 'update', 'archive', 'delete', 'read']
const permissionValues = RESOURCES.flatMap((resource) =>
  ACTIONS.map((perm) => ({ action: `${perm}:${resource}` }))
)

async function seed() {
  await db.insert(roles).values(roleValues)
  await db.insert(permissions).values(permissionValues)

  // Fetch role and permission IDs to create links
  const [adminRole] = await db.select().from(roles).where(eq(roles.name, 'admin'))
  const [userRole] = await db.select().from(roles).where(eq(roles.name, 'user'))
  const perms = await db.select().from(permissions)

  // everything
  const adminPerms = perms.map((p) => ({ roleId: adminRole.id, permissionId: p.id }))

  // all on links, and archive self (enforce ownership check at runtime)
  const userPerms = perms
    .filter((p) => p.action.endsWith('link') || p.action === 'archive:user')
    .map((p) => ({ roleId: userRole.id, permissionId: p.id }))

  await db.insert(rolePermissions).values([...adminPerms, ...userPerms])

  console.log('🪴: seeding complete')
}

seed()
