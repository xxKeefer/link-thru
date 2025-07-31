import {
  integer,
  pgTable,
  text,
  varchar,
  timestamp,
  index,
  boolean,
  uuid,
  primaryKey,
} from 'drizzle-orm/pg-core'

// -------------------- Links --------------------
export const shortenLinkTable = pgTable(
  'shorten_link',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    url: text().notNull(),
    shortCode: varchar({ length: 10 }).notNull().unique(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
    hits: integer().notNull().default(0),
    archived: boolean().notNull().default(false),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [index('short_code_idx').on(table.shortCode)]
)

// -------------------- Users --------------------
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
})

// -------------------- Roles --------------------
export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).unique().notNull(), // e.g. 'admin', 'editor'
})

// -------------------- Permissions --------------------
export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  action: varchar('action', { length: 100 }).unique().notNull(), // e.g. 'delete:user'
})

// -------------------- User Roles (many-to-many) --------------------
export const userRoles = pgTable(
  'user_roles',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] })]
)

// -------------------- Role Permissions (many-to-many) --------------------
export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })]
)
