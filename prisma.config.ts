import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import path from "path";
// Environment variable type define karo
type Env = {
  DATABASE_URL: string;
};

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    
    url: env<Env>("DATABASE_URL"),
  },
});