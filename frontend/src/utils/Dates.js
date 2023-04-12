export default function subDates(dt_date1, dt_date2) {
    return Math.abs(dt_date1.getTime() - dt_date2.getTime());
}
