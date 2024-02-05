export default class Editor {
    static canvas = document.querySelector('canvas');
    static ctx = this.canvas.getContext('2d');
    static w = null;
    static h = null;
    static raw = null;
    static settingsNames = [];

    static edit(data) {
        let rgb = colors => {
            let c = [this.red, this.green, this.blue];
            return colors.map((color, i) => color + c[i])
        }

        let level = colors => {
            return colors.map(color => color + this.lvl)
        }

        let contrast = colors => {
            let factor = (256 * (this.contrast + 255)) / 
                         (255 * (256 - this.contrast));

            return colors.map(color => factor * (color - 128)+128)
        }

        let grayscale = colors => {
            let [r,g,b] = colors;
            let gray = this.sR * r + this.sG * g + this.sB * b;
            r = -gray * this.saturation + r * (1+ this.saturation);
            g = -gray * this.saturation + g * (1+ this.saturation);
            b = -gray * this.saturation + b * (1+ this.saturation);
            return [r,g,b];
        }

        let fns = [rgb, level, contrast, grayscale];

        let compose = colors => fns.reduce((acc, fn) => fn(acc), colors);

        for(let i = 0; i < data.length; i+=4) {
            [data[i+0],data[i+1],data[i+2]] = compose([data[i+0],data[i+1],data[i+2]])
        }
    }

    static draw(raw = this.raw) {
        this.raw = raw;
        [this.w, this.h] = [this.canvas.width, this.canvas.height]
                         = [raw.width, raw.height].map(e => e * this.size);
        this.ctx.drawImage(raw, 0, 0, raw.width, raw.height,
                                0, 0, this.w,  this.h);
        let data = this.ctx.getImageData(0, 0, this.w, this.h);
        this.edit(data.data)
        this.ctx.putImageData(data, 0, 0)

                        
    }

    static controls() {
        let createRange = (name, min, max, step, val, space) => {
            let block = document.createElement('div');
            block.className = 'input_p';
            block.innerHTML = `
                <div class="input_p">
                    <div>${name}</div>
                    <div>${val}</div>
                    <input type="range" name="" id="" min=${min} max=${max} step=${step} value=${val}>
                </div>
            `;

            space.append(block);
            this.settingsNames.push(name);

            this[name] = val;
            block.querySelector('input').addEventListener('input', ({target}) => {
                let value = Number(target.value);

                this[name] = value;
                target.previousElementSibling.innerHTML = value;
                if(this.raw) this.draw();
            })
        }

        let size = document.querySelector('.size');
        let colors = document.querySelector('.colors');
        let light = document.querySelector('.light');
        let grayscale = document.querySelector('.grayscale')

        createRange('size', 0, 2,0.01, 1, size);
        createRange('red', -255, 255,1, 0, colors);
        createRange('green', -255, 255,1, 0, colors);
        createRange('blue', -255, 255,1, 0, colors);
        createRange('lvl', -255, 255,1, 0, light);
        createRange('contrast', -255, 255,1, 0, light);
        createRange('saturation', -1, 1, 0.01, 1, grayscale);
        createRange('sR', 0, 2, 0.001, 0.299, grayscale);
        createRange('sG', 0, 2, 0.001, 0.587, grayscale);
        createRange('sB', 0, 2, 0.001, 0.114, grayscale);
        console.log(`Настройки: ${this.settingsNames.map((e,i) => i + e)}`)
    }
}