import React from 'react';
import { Reservation } from '../types';
import { TIME_SLOTS } from '../constants';
import { roomLayouts, RoomLayout } from './common/layouts';

interface SeatLayoutProps {
    location: string;
    selectedSeat: string;
    selectedTimeSlot: string;
    onSeatSelect: (seat: string) => void;
    todayReservations: Reservation[];
}

const SeatLayout: React.FC<SeatLayoutProps> = ({
    location,
    selectedSeat,
    selectedTimeSlot,
    onSeatSelect,
    todayReservations,
}) => {
    const layout: RoomLayout | undefined = roomLayouts[location];

    if (!layout) {
        return <p className="text-center text-gray-500">해당 장소의 좌석 배치도 정보가 없습니다.</p>;
    }

    const isSeatAvailable = (seatNumber: number) => {
        if (!selectedTimeSlot) return false;
        const selectedTimeSlotLabel = TIME_SLOTS.find(t => t.id === selectedTimeSlot)?.label || '';
        return !todayReservations.some(
            r => r.location === location && r.seat === seatNumber.toString() && r.timeSlot === selectedTimeSlotLabel
        );
    };

    const getCellContent = (cell: any, cellIndex: number) => {
        switch (cell.type) {
            case 'seat':
                const seatStr = cell.number!.toString();
                const isAvailable = isSeatAvailable(cell.number!);
                const isSelected = selectedSeat === seatStr;

                const baseClasses = 'w-14 h-14 flex items-center justify-center rounded-lg border-2 transition-all text-sm';
                let stateClasses = '';

                if (isSelected) {
                    stateClasses = 'bg-blue-500 text-white border-blue-500 scale-110 shadow-lg';
                } else if (isAvailable) {
                    stateClasses = 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer';
                } else {
                    stateClasses = 'bg-red-100 border-red-300 text-red-600 cursor-not-allowed dark:bg-red-900/50 dark:border-red-700 dark:text-red-300';
                }

                if (!selectedTimeSlot) {
                     stateClasses += ' opacity-50 cursor-not-allowed';
                }

                return (
                    <div key={`seat-${cell.number}`} className="p-1 flex-shrink-0" style={{ gridColumn: `span ${cell.span || 1}` }}>
                        <button
                            onClick={() => onSeatSelect(seatStr)}
                            disabled={!isAvailable || !selectedTimeSlot}
                            className={`${baseClasses} ${stateClasses}`}
                            aria-label={`Seat ${cell.number}`}
                        >
                            <div className="font-bold text-lg">{cell.number}</div>
                        </button>
                    </div>
                );

            case 'label':
                return (
                    <div key={`label-${cellIndex}`} className="p-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs w-full" style={{ gridColumn: `span ${cell.span || 1}` }}>
                         <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 w-full text-center">{cell.text}</div>
                    </div>
                );

            case 'space':
                 return <div key={`space-${cellIndex}`} className="p-1" style={{ gridColumn: `span ${cell.span || 1}` }} />;

            default:
                return null;
        }
    };


    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
             {!selectedTimeSlot && (
                <div className="text-center text-sm text-yellow-600 dark:text-yellow-400 mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/50 rounded-md">
                   시간대를 먼저 선택해야 좌석을 지정할 수 있습니다.
                </div>
            )}
            <div className="flex flex-col items-center gap-2">
                {layout.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="flex justify-center items-stretch w-full gap-2">
                         {row.map(getCellContent)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeatLayout;