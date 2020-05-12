import React, { Component } from "react";
import * as loadImage from 'blueimp-load-image';

import {fixImageRotation} from 'fix-image-rotation';

import exif from 'exif-js';


export function exReadFile(file) {
    return new Promise(resolve => {
        var reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
};

export function exCreateImage(data) {
    return new Promise(resolve => {
        const img = document.createElement('img');
        img.onload = () => resolve(img);
        img.src = data;

    })
}

export function exRotate(type, img) {
    return new Promise(resolve => {
        const canvas = document.createElement('canvas');


        exif.getData(img, function () {
            var orientation = exif.getAllTags(this).Orientation;

            if ([5, 6, 7, 8].indexOf(orientation) > -1) {
                canvas.width = img.height;
                canvas.height = img.width;
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }




            var ctx = canvas.getContext("2d");

            console.log("running" + ctx)


            switch (orientation) {
                case 2:
                    ctx.transform(-1, 0, 0, 1, img.width, 0);
                    break;
                case 3:
                    ctx.transform(-1, 0, 0, -1, img.width, img.height);
                    break;
                case 4:
                    ctx.transform(1, 0, 0, -1, 0, img.height);
                    break;
                case 5:
                    ctx.transform(0, 1, 1, 0, 0, 0);
                    break;
                case 6:
                    ctx.transform(0, 1, -1, 0, img.height, 0);
                    break;
                case 7:
                    ctx.transform(0, -1, -1, 0, img.height, img.width);
                    break;
                case 8:
                    ctx.transform(0, -1, 1, 0, 0, img.width);
                    break;
                default:
                    ctx.transform(1, 0, 0, 1, 0, 0);
            }

            ctx.drawImage(img, 0, 0, img.width, img.height);

            ctx.toBlob(resolve, type);

            // callback(canvas.toDataURL());

            // callback(canvas.toDataURL());
            //
            // console.log("rotated image" + canvas.toDataURL())

        });
    })
}

export function resetOrientation(srcBase64, srcOrientation, callback) {
    var img = new Image();

    img.onload = function() {
        var width = img.width,
            height = img.height,
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext("2d");

        // set proper canvas dimensions before transform & export
        if (4 < srcOrientation && srcOrientation < 9) {
            canvas.width = height;
            canvas.height = width;
        } else {
            canvas.width = width;
            canvas.height = height;
        }

        // transform context before drawing image
        switch (srcOrientation) {
            case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
            case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
            case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
            case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
            case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
            case 7: ctx.transform(0, -1, -1, 0, height, width); break;
            case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
            default: break;
        }

        // draw image
        ctx.drawImage(img, 0, 0);

        // export base64
        callback(canvas.toDataURL());
    };

    img.src = srcBase64;
};


class EXIFImageLoader extends Component {
    handleChange = (event) => {
        event.target.files.forEach(
            file => exReadFile(file)
                .then(exCreateImage)
                .then(exRotate.bind(undefined, file.type))
                .then(blob => {
                    blob.name = file.name;

                    // this.uploader.startUpload(blob);

                    this.props.imageUploadWithEXIF(blob)

                })
        );
    }

    render() {
        return (
            <input
                {...this.props}
                ref={ref => this.uploader = ref}
                onChange={this.handleChange}
            />
        );
    }
}

export default EXIFImageLoader;




