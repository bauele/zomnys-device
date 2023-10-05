import { Link } from 'react-router-dom';
import Button from '../components/button';

type LogAwakeningProps = {
    onAwakeningLogged(timestamp: Date, reason: String): void;
};

export default function LogAwakening({ onAwakeningLogged }: LogAwakeningProps) {
    return (
        <div>
            <Link to="/">
                <Button
                    onClick={() => {
                        onAwakeningLogged(new Date(), 'General');
                    }}
                    text="General"
                />

                <Button
                    onClick={() => {
                        onAwakeningLogged(new Date(), 'Hunger/Thirst');
                    }}
                    text="Hunger/Thirst"
                />

                <Button
                    onClick={() => {
                        onAwakeningLogged(new Date(), 'Bathroom');
                    }}
                    text="Bathroom"
                />

                <Button
                    onClick={() => {
                        onAwakeningLogged(new Date(), 'Nightmare');
                    }}
                    text="Nightmare"
                />
            </Link>
            <Link to="/">
                <Button onClick={() => {}} text="Go Back" />
            </Link>
        </div>
    );
}
