export interface AddShowTime {
    showTime_public_id:string,
    showtime_name:string,
    movie_public_id:string,
    theater_public_id:string,
    date_time:string,
    showtime_status: "housefull" | "cancelled" | "scheduled" | "completed" | "running",
    city:string,
    showtime_price:number,
    total_seats:number,
}