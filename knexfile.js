module.exports = {
    development: {
        client: 'pg',
       connection: {
            connectionString: 'postgres://hr_tool_db_user:IekMEYqzqciFT72K2nEyCFiUr5YZKJ7M@dpg-cpis6pq1hbls73bm7dl0-a/hr_tool_db',
            ssl: { rejectUnauthorized: false } // This line might be needed if your database requires SSL
           
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
        connection: {
            connectionString: 'postgres://hr_tool_db_user:IekMEYqzqciFT72K2nEyCFiUr5YZKJ7M@dpg-cpis6pq1hbls73bm7dl0-a/hr_tool_db',
            ssl: { rejectUnauthorized: false } // This line might be needed if your database requires SSL
        },
        migrations: {
            directory: __dirname + '/db/migrations',
        },
        seeds: {
            directory: __dirname + '/db/seeds',
        },
    },
};
