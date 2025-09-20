<?php

return [
    /*
     * The name of the table that will be created by the migration and
     * used by the Activity model.
     */
    'table_name' => 'activity_log',

    /*
     * The database connection to use.
     * Default to the main connection defined in .env (DB_CONNECTION).
     */
    'database_connection' => env('DB_CONNECTION', 'mysql'),

];