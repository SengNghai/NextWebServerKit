import styles from './styles.module.scss';

interface ChatHeaderProps {
    title: string; // title
}

export default function ChatHeader({ title }: ChatHeaderProps) {
    return (
        <header className={styles.chatHeader}>
           <h3 className={styles.title}>{title}</h3> 
        </header>
    );
}