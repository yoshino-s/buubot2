import Jimp from "jimp";
import { readFileSync } from "fs";
import { resolve } from "path";
readFileSync(resolve(__dirname, "./open-sans-16-black.fnt")).toString();
readFileSync(resolve(__dirname, "./open-sans-16-black.png")).toString();

const map = ([
  [" ", 255],
  ["I", 180],
  ["V", 162],
  ["L", 162],
  ["U", 159],
  ["C", 158],
  ["Y", 158],
  ["T", 153],
  ["J", 152],
  ["A", 144],
  ["X", 142],
  ["Z", 140],
  ["N", 136],
  ["G", 133],
  ["F", 132],
  ["P", 121],
  ["O", 120],
  ["E", 111],
  ["K", 101],
  ["D", 91],
  ["W", 82],
  ["R", 78],
  ["H", 76],
  ["Q", 72],
  ["B", 72],
  ["S", 127],
  ["M", 50],
] as [string, number][]).sort((a, b) => a[1] - b[1]);
export default function textify(fromPath: string, toPath: string, pixel = 8) {
  return Jimp.read(fromPath)
    .then((img) => {
      const [width, height] = [img.getWidth(), img.getHeight()];
      return img
        .crop(0, 0, width - (width % pixel), height - (height % pixel))
        .greyscale();
    })
    .then(async (img) => {
      const [width, height] = [img.getWidth(), img.getHeight()];
      const newImg = new Jimp(
        (width / pixel) * 16,
        (height / pixel) * 16,
        0xffffffff
      );
      const font = await Jimp.loadFont(
        resolve(__dirname, "./open-sans-16-black.fnt")
      );
      for (let y = 0; y < height; y += pixel) {
        for (let x = 0; x < width; x += pixel) {
          let cnt = 0;
          for (let ix = x; ix < x + pixel; ix++) {
            for (let iy = y; iy < y + pixel; iy++) {
              if (
                parseInt(
                  img
                    .getPixelColor(ix, iy)
                    .toString(16)
                    .padStart(8, "0")
                    .slice(0, 2),
                  16
                ) >
                255 / 2
              )
                cnt++;
            }
          }
          const grey = (cnt / pixel ** 2) * 255;
          newImg.print(
            font,
            (x / pixel) * 16,
            (y / pixel) * 16,
            map.find((i) => grey < i[1])?.[1] || " "
          );
        }
      }
      return newImg.write(toPath);
    });
}
