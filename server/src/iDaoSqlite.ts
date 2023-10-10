import sqlite3 from 'sqlite3';
import { DAOType } from './DaoType';

export class iDAOSqlite {
    protected database: sqlite3.Database | null;

    constructor() {
        this.database = null;
    }

    protected initializeDao(path: string, createOpenTableStatement: string) {
        const createOpenDatabase = (success: () => void) => {
            //  Create database if it doesn't already exist
            this.database = new sqlite3.Database(
                path,
                sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
                (error) => {
                    if (error) {
                        console.error(
                            `Error creating database at ${path}:  ${error}`,
                        );
                    } else {
                        success();
                    }
                },
            );
        };

        const createOpenTable = (success: () => void) => {
            //  Create table if it doesn't already exist
            this.database?.exec(createOpenTableStatement, (error) => {
                if (error) {
                    console.error('Error creating/opening table: ' + error);
                } else {
                    success();
                }
            });
        };

        return new Promise((success: Function) => {
            createOpenDatabase(() => {
                createOpenTable(() => {
                    success();
                });
            });
        });
    }

    protected getAllDaoType(tableName: string, rowCallback: Function) {
        return new Promise((completion: (daoType: DAOType[]) => void) => {
            //  Each row will contain fields matching the table
            try {
                this.database?.each(
                    // SQL query to run
                    `SELECT * FROM ${tableName}`,

                    // Callback performed on each returned row
                    rowCallback,

                    //  Callback performed on completion of query
                    completion,
                );
            } catch (e) {
                console.error('Error getting from database: ' + e);
            }
        });
    }
}
