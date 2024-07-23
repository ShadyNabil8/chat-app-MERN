export const getFormattedDate = () => {

    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12; // Will cause 0 instade of 12
    hours = hours ? hours : 12; // Fix the above issue

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);

    return `${today} ${formattedTime}`

}