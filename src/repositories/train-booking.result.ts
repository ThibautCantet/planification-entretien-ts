export type TrainBookingResult = {
    trainReservationId: string,
    date: string,
    price: number
    details: {
        departure: string,
        destination: string,
    }
}