import pool from "../config/db.js";
import type { EditShowTimeInput } from "../schemas/schema.editShowTime.js";
import type { AddShowTime } from "../types/type.addShowtime.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

const showTimeModel = {

    async filterShowtime(limit:number,offset:number){

        const sql = `SELECT 
                    showtime_public_id, showtime_name 
                    FROM showtime
                    LIMIT ${limit} OFFSET ${offset}`;
        console.log(sql);
        const [shows] = await pool.execute(sql);
        consoe.log(shows);
        return shows ?? null;
    },
    
    async insert(showTime:AddShowTime){
        const sql = `INSERT INTO 
                    showtime(showtime_public_id, showtime_name, movie_public_id, theater_public_id, date_time, showtime_status, city,showtime_price)
                    VALUES(?,?,?,?,?,?,?,?)`;
        const [result] = await pool.execute<ResultSetHeader>(sql,[
            showTime.showTime_public_id,
            showTime.showtime_name,
            showTime.movie_public_id,
            showTime.theater_public_id,
            showTime.date_time,
            showTime.showtime_status,
            showTime.city,
            showTime.showtime_price
        ]);

        if (result.affectedRows > 0)
            return true
        else
            return false
    },

    async update(showtime:EditShowTimeInput,showTime_public_id:string){

        const skipFields = ["old_total_seats","new_total_seats"];
        
        const keys = Object.keys(showtime).filter(
            key => !skipFields.includes(key)
        );

        if (keys.length === 0) return;
        
        const fields = keys.map(k => `${k} = ?`).join(",");
        const values = keys.map(k => (showtime as any)[k]);

        const sql = `UPDATE showtime SET ${fields} WHERE showtime_public_id = ?`;
        const [result] =  await pool.execute<ResultSetHeader>(sql,[...values,showTime_public_id]);

        if (result.affectedRows > 0)
            return true
        else
            return false
    },

    async delete(showTime_public_id:string){
        const sql = "DELETE FROM showtime WHERE showtime_public_id = ?";
        const [result] = await pool.execute<ResultSetHeader>(sql,[showTime_public_id]);

        if(result.affectedRows > 0)
            return true
        else
            return false
    },

    async housefull(showTime_public_id:string){
        const sql = "UPDATE showtime SET showtime_status = 'housefull' WHERE showtime_public_id = ?";
        return await pool.execute(sql,[showTime_public_id]);
    },

    async cancel(showTime_public_id:string){
        const sql = "UPDATE showtime SET showtime_status = 'cancel' WHERE showtime_public_id = ?";
        return await pool.execute(sql,[showTime_public_id]);
    },

    async fetchShowTime(showTime_public_id:string){
        const sql = `SELECT 
                    showtime_name, movie_public_id, theater_public_id, 
                    DATE_FORMAT(date_time, '%Y-%m-%dT%H:%i') AS date_time,
                    showtime_price, city, showtime_status
                    FROM showtime WHERE showtime_public_id = ?`;
        const [show] = await pool.execute< [RowDataPacket] >(sql,[showTime_public_id]);
        return show[0] ?? null;
    },

    async available(showTime_public_id:string){
        const sql = "UPDATE showtime SET showtime_status = 'housefull' WHERE showtime_public_id = ?";
        return await pool.execute(sql,[showTime_public_id]);
    },

    async validate(date:string,time:string,screen_public_id:string){
        const sql = `SELECT count(showtime_public_id) 
                    FROM showtime 
                    WHERE 
                    date = ? AND time = ? 
                    AND screen_id = ?
                    AND showtime_status NOT = 'cancel' `;

        const [showtime_public_ids] = await pool.execute< [RowDataPacket] >(sql,[date,time,screen_public_id]);
        return showtime_public_ids ?? null;
    },

    async fetchShowTimeAtScreen(showTime_public_id:string){
        const sql = "UPDATE showtime SET showtime_status = 'housefull' WHERE showtime_public_id = ?";
        const [shows] = await pool.execute< [RowDataPacket] >(sql,[showTime_public_id]);
        return shows ?? null;
    },

    async fetchByMovieAndTheaterDate(movie_public_id:string,theater_public_ids:string[],date:string){

        const placeholders = theater_public_ids.map(() => "?").join(",");
        const sql = `SELECT 
                    showtime_public_id, date_time, showtime_status,theater_public_id,showtime_price
                    FROM showtime
                    WHERE movie_public_id = ?
                    AND theater_public_id IN (${placeholders})
                    AND date_time >= ?
                    AND date_time < DATE_ADD(?, INTERVAL 3 DAY)`;

        const [shows] = await pool.execute< [RowDataPacket] >(sql,[
            movie_public_id,
            ...theater_public_ids,
            date,
            date
        ]);

        return shows;
    }
};

export default showTimeModel;
