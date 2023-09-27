type ClockProps = {
    date: Date;
};

export default function Clock({ date }: ClockProps) {
    return <h1>{date.toLocaleTimeString()}</h1>;
}
