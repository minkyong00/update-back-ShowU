import Seat from "../../models/reservation/seatSchema.js";
import { parseISO, format } from "date-fns";

// 좌석 예약 생성
export const createSeatReservation = async (req, res) => {
  try {
    const { showId, date, time, seatNumbers, userId } = req.body;
    const parsedDate = new Date(date);
    parsedDate.setUTCHours(0, 0, 0, 0); // 시간을 UTC로 설정하여 시간 부분 제거
    const formattedDate = parsedDate.toISOString(); // 전체 ISO 형식 유지

    // 기존에 예약된 좌석 수 확인
    const existingReservations = await Seat.find({
      showId,
      date: new Date(formattedDate),
      time,
      userId,
    });

    // 예약된 좌석 수와 새로 예약하려는 좌석 수를 합산하여 2개를 초과하는지 확인
    const totalReservedSeats = existingReservations.reduce(
      (total, reservation) => {
        return total + reservation.seatNumbers.length;
      },
      0
    );

    if (totalReservedSeats + seatNumbers.length > 2) {
      return res
        .status(400)
        .json({ message: "한 아이디당 최대 2매까지 예매 가능합니다!" });
    }

    const newSeatReservation = new Seat({
      showId,
      date: new Date(formattedDate), // UTC로 설정된 날짜 사용
      time,
      seatNumbers,
      userId,
    });

    await newSeatReservation.save();
    res.status(201).json({ message: "Seat reservation created successfully" });
  } catch (error) {
    console.error("Failed to create seat reservation:", error);
    res
      .status(500)
      .json({
        message: "Failed to create seat reservation",
        error: error.message,
      });
  }
};

// 잔여 좌석 조회
export const getAvailableSeats = async (req, res) => {
  try {
    const { showId, date, time } = req.query;
    const parsedDate = parseISO(date);
    const formattedDate = format(parsedDate, "yyyy-MM-dd");

    console.log("Parsed Date:", parsedDate);
    console.log("Formatted Date:", formattedDate);

    const reservedSeats = await Seat.find({
      showId,
      date: new Date(formattedDate),
      time,
    });
    console.log("Reserved Seats:", reservedSeats);
    const reservedSeatNumbers = reservedSeats.flatMap(
      (seat) => seat.seatNumbers
    );
    console.log("Reserved Seat Numbers:", reservedSeatNumbers);

    const seats = [];
    for (let i = 0; i < 100; i++) {
      const row = Math.floor(i / 10) + 1;
      const col = (i % 10) + 1;
      seats.push(`${row}-${col}`);
    }

    const availableSeats = seats.filter(
      (seat) => !reservedSeatNumbers.includes(seat)
    );
    console.log("Available Seats:", availableSeats);

    res.status(200).json(availableSeats);
  } catch (error) {
    console.error("잔여 좌석 조회 중 오류 발생:", error);
    res
      .status(500)
      .json({ message: "잔여 좌석 조회 중 오류 발생", error: error.message });
  }
};

// 예약된 좌석 조회
export const getReservedSeats = async (req, res) => {
  try {
    const { showId, date, time } = req.query;
    const parsedDate = parseISO(date);
    const formattedDate = format(parsedDate, "yyyy-MM-dd");

    console.log("Parsed Date:", parsedDate);
    console.log("Formatted Date:", formattedDate);

    const reservedSeats = await Seat.find({
      showId,
      date: new Date(formattedDate),
      time,
    });
    console.log("Reserved Seats:", reservedSeats);
    res.status(200).json(reservedSeats);
  } catch (error) {
    console.error("예약된 좌석 조회 중 오류 발생:", error);
    res
      .status(500)
      .json({ message: "예약된 좌석 조회 중 오류 발생", error: error.message });
  }
};
