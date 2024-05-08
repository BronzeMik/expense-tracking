import schema from './utils/schema'
/** @type { import("drizzle-kit").Config } */
export default {
    schema: './utils/schema.jsx',
    driver: 'pg',
    dbCredentials: {
      connectionString: 'postgresql://track-my-expenses_owner:XEcyzOiS0tF9@ep-solitary-meadow-a5d04nul.us-east-2.aws.neon.tech/track-my-expenses?sslmode=require',
    }
  };
