import type { Request, Response } from "express"
import { AddShowTimeSchema } from "../schemas/schema.addShowTime.js";
import { EditShowTimeSchema } from "../schemas/schema.editShowTime.js"
import showTimeService from "../services/service.showTime.js";
import { ValidateShowtimeSchema } from "../schemas/schema.validateShowtime.js";
import { GetShowTimeSchema} from "../schemas/schema.getShowtime.js";

const showTimeController = {

    async filterShow(req:Request,res:Response){
        try{
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.limit as string) || 0;
            const shows = await showTimeService.filterShow(limit,offset);
            return res.status(200).json(shows);
        } catch(err:any){
            console.log(err.message)
            return res.status(500).json({error:err});
        }
    },

    async add(req:Request,res:Response){
        try{

            const showTime = AddShowTimeSchema.parse(req.body);
            const done = await showTimeService.add(showTime);

            if(done)
                return res.status(201).json({message:"ShowTime Added"});
            else
                return res.status(400).json({message:"Showtime Can't Be Added"});

        } catch(err:any){
            console.log(err.message)
            return res.status(500).json({error:err});
        }
    },

    async edit(req:Request,res:Response){
        try{

            const showTime = EditShowTimeSchema.parse(req.body);
            const showTime_public_id = req.params.showtime_public_id as string;

            if(!showTime_public_id){
                return res.status(400).json({message:"Showtime Public Id Not Found"})
            }

            await showTimeService.edit(showTime,showTime_public_id);
            return res.status(201).json({message:"ShowTime Updated"});
        } catch(err:any){
            console.log(err.message)
            return res.status(500).json({error:err});
        }
    },

    async remove(req:Request,res:Response){
        try{
            const showTime_public_id = req.params.showtime_public_id as string;

            if(!showTime_public_id){
                return res.status(400).json({message:"Showtime Public Id Not Found"})
            }

            await showTimeService.remove(showTime_public_id);
            return res.status(200).json({message:"Deleted"});
        }catch(err) {
            return res.status(500).json({error:err});
        }
    },

    async housefull(req:Request,res:Response){
        try{
            const showTime_public_id = req.params.showTime_public_id as string;

            if(!showTime_public_id){
                return res.status(400).json({message:"Showtime Public Id Not Found"})
            }

            await showTimeService.housefull(showTime_public_id);
            return res.status(200).json({message:"Show Time Status Changed To Housefull"})

        }catch(err){
            return res.status(500).json({error:err});
        }
    },

     async cancel(req:Request,res:Response){
        try{

            const showTime_public_id = req.params.showTime_public_id as string;

            if(!showTime_public_id){
                return res.status(400).json({message:"Showtime Public Id Not Found"})
            }

            await showTimeService.cancel(showTime_public_id);
            return res.status(200).json({message:"Show Time Status Changed To Cancel"})

        }catch(err){

            return res.status(500).json({error:err});
        }
    },

    async getShowtime(req:Request,res:Response){
        try{
            const showTime_public_id = req.params.showtime_public_id as string;
            
            if(!showTime_public_id){
                return res.status(400).json({message:"Showtime Public Id Not Found"})
            }

            const showTime = await showTimeService.getShowTime(showTime_public_id);
            return res.status(200).json(showTime);

        } catch(err){
            return res.status(500).json({error:err});
        }
    },

    async available(req:Request,res:Response){
        try{
            const showTime_public_id = req.params.showTime_public_id as string;

            if(!showTime_public_id){
                return res.status(400).json({message:"Showtime Public Id Not Found"})
            }

            const showTime = await showTimeService.available(showTime_public_id);
            return res.status(200).json(showTime);

        } catch( err ){
            return res.status(500).json({error:err});
        }
    },

    async validate(req:Request,res:Response){
         try{
            const values = ValidateShowtimeSchema.parse(req.body);
            const showTime = await showTimeService.validate(values);
            return res.status(200).json(showTime);
        } catch( err ){
            return res.status(500).json({error:err});
        }
    },

    async getShowTimeAtScreen(req:Request,res:Response){
        try{
            const screen_public_id = req.params.screen_public_id as string;

            if(!screen_public_id){
                return res.status(400).json({message:"Showtime Public Id Not Found"})
            }

            const showTime = await showTimeService.available(screen_public_id);
            return res.status(200).json(showTime);
        } catch(err) {
            return res.status(500).json({error:err});
        }
    },

    async findByMovieAndTheaterDate(req:Request,res:Response){
        try{
            const movie_public_id = req.params.movie_public_id as string;
            const parsed = GetShowTimeSchema.parse(req.body);
            const theater_public_ids = parsed.theater_public_id;
            const date = req.query.date as string;
            
            if(!movie_public_id || !date)
                return res.status(400).json({message:"Params OR Query Missing"});

            const showTimes = await showTimeService.findByMovieAndTheaterDate(movie_public_id,theater_public_ids,date);
            return res.status(200).json(showTimes);
        }catch(err:any){
            console.log(err.message)
            return res.status(500).json(err);
        }
    }

    
}

export default showTimeController;