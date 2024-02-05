import Loader from "./Loader.js";
import Editor from "./Editor.js";


class Main {
    static init() {
        this.img = document.querySelector('.raw img');
        Editor.controls();
        Loader.init(this);
    }

    static draw() {
        Editor.draw(this.img);
    }

    static listeners() {
        document.querySelector('#original').onclick = () => {
            document.querySelector('.raw').classList.toggle('hide')
        }
        document.querySelector('#rotate').onclick = () => {
            document.querySelector('.view').classList.toggle('grid')
        }
    }
}

Main.init();
console.log('Main загружен')