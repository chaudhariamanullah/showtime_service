import type { AddShowTimeInput } from "../schemas/schema.addShowTime.js";
import type { EditShowTimeInput } from "../schemas/schema.editShowTime.js";
import type { ValidateShowtimeInput } from "../schemas/schema.validateShowtime.js";
import showTimeModel from "../models/model.showTime.js";
import { v4 as uuidv4 } from "uuid";

const showTimeService = {

    async filterShow(limit:number,offset:number){
        return await showTimeModel.filterShowtime(limit,offset);
    },

    async add(showtime:AddShowTimeInput){
        const showTime_public_id = uuidv4();

        const date_time = showtime.date_time.replace("T", " ") + ":00";

        const insert = await showTimeModel.insert({
            showTime_public_id,
            showtime_name:showtime.showtime_name,
            movie_public_id: showtime.movie_public_id,
            theater_public_id: showtime.theater_public_id,
            date_time,
            showtime_status: showtime.showtime_status,
            city:showtime.city,
            showtime_price:showtime.showtime_price,
            total_seats:showtime.total_seats        
        });

        if(insert){
            const res = await fetch(`http://localhost:3005/seats`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    total_seats:showtime.total_seats,
                    showtime_public_id:showTime_public_id
                })
            })
            
            if(res.ok){
                return true;
            } else {
                showTimeModel.delete(showTime_public_id);
                return false;
            }      
        }else{
            return false
        }
    },

    async edit(showtime:EditShowTimeInput,showTime_public_id:string){

        const old_total_seats = showtime?.old_total_seats || 0;
        const new_total_seats = showtime?.new_total_seats || 0;

        const update = await showTimeModel.update(showtime,showTime_public_id);

        if(update && old_total_seats === new_total_seats){

            return true;

        }else if( update && old_total_seats !== new_total_seats){

            if(old_total_seats < new_total_seats){
                const difference_seats = new_total_seats - old_total_seats;
                const res = await fetch(`http://localhost:3005/seats/`,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        total_seats:difference_seats,
                        showtime_public_id:showTime_public_id
                    })
                });

                if(res.ok)
                    return true
                else
                    return false
            }else{
                const difference_seats = old_total_seats - new_total_seats;
                const res = await fetch(`http://localhost:3005/seats/bulk-remove/`,{
                    method:"DELETE",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        total_seats:difference_seats,
                        showtime_public_id:showTime_public_id
                    })
                });

                if(res.ok)
                    return true
                else
                    return false
            }
        }else{
            return false
        }
    },

    async remove(showTime_public_id:string){
        return await showTimeModel.delete(showTime_public_id)
    },

    async housefull(showTime_public_id:string){
        return await showTimeModel.housefull(showTime_public_id);
    }, 

    async cancel(showTime_public_id:string){
        return await showTimeModel.cancel(showTime_public_id);
    },

    async getShowTime(showTime_public_id:string){
        return await showTimeModel.fetchShowTime(showTime_public_id);
    },

    async available(showTime_public_id:string){
        return await showTimeModel.available(showTime_public_id);
    },

    async validate(value:ValidateShowtimeInput){
        const date = value.dateAndTime.toISOString().slice(0,10);
        const time = value.dateAndTime.toISOString().slice(11,19);
        const screen_public_id = value.screen_public_id;
        return await showTimeModel.validate(date,time,screen_public_id);
    },

    async getShowTimeAtScreen(showTime_public_id:string){
        return await showTimeModel.fetchShowTimeAtScreen(showTime_public_id);
    },

    async findByMovieAndTheaterDate(movie_public_id:string,theater_public_ids:string[],date:string){
        return await showTimeModel.fetchByMovieAndTheaterDate(movie_public_id,theater_public_ids,date)
    }
}

export default showTimeService;