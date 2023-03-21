export const hexToRGBA = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

export const animateCircle = (line: google.maps.Polyline) => {
    let count = 0;

    window.setInterval(() => {
        count = (count + 1) % 1600;

        const icons = line.get("icons");

        icons[0].offset = count / 16 + "%";
        line.set("icons", icons);
    }, 20)
}