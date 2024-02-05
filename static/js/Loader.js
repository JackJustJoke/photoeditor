export default class Loader {
    static init(main) {
        this.main = main;

        document.querySelector('#input-file').addEventListener(
            'change', this.load.bind(this)
        );
    }

    static load({target}) {
        let file = target.files[0];
        let url = URL.createObjectURL(file);
        if(file.type.includes('image')) {
            console.log(this.main.img)
            this.main.img.src = url;
            this.main.img.onload = () => {
                this.main.draw();
            }
        }
    }
}