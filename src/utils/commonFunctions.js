export function extractFileId(url) {
    const segments = url.split('/');
    const filesIndex = segments.indexOf('files');

    if (filesIndex !== -1 && filesIndex < segments.length - 1) {
        return segments[filesIndex + 1];
    }

    return null; // Return null if file ID is not found
}

export function convertStringToDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);

    // Define month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Extract the date components
    const day = dateTime.getDate();
    const monthIndex = dateTime.getMonth();
    const year = dateTime.getFullYear();

    // Extract the time components
    let hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const amPm = hours >= 12 ? 'pm' : 'am';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Return the formatted date and time
    const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${amPm}`;

    return { date: formattedDate, time: formattedTime };
}