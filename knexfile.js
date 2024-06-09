module.exports = {
    development: {
        client: 'pg',
        connection: {
            database: "hr_tool_db",
            host: "dpg-cpis6pq1hbls73bm7dl0-a",
            user: "hr_tool_db_user",
            password: "IekMEYqzqciFT72K2nEyCFiUr5YZKJ7M"
        },
        migrations: {
            directory: __dirname + '/db/migrations',
        },
        seeds: {
            directory: __dirname + '/db/seeds',
        },
        pool: {
            min: 2,
            max: 10
        }
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: __dirname + '/db/migrations',
        },
        seeds: {
            directory: __dirname + '/db/seeds',
        },
    },
};
