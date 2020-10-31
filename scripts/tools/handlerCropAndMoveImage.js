import roundRect from "../tools/roundRect";

const handlerCropAndMoveImage = (canvas, canvasFrame, image) => {
        const ctx = canvas.getContext('2d');
        canvas.width = 700;
        canvas.height = 550;
        canvasFrame.width = 700;
        canvasFrame.height = 550;
        
        const ctxFrame = canvasFrame.getContext('2d');
        ctxFrame.fillStyle = 'rgba(0, 0, 0, 0.5)';
        roundRect(ctxFrame, ((canvas.width - 300) / 2), ((canvas.height - 405) / 2), 300, 405, 5);

        trackTransforms(ctx);
        function redraw(){
            var p1 = ctx.transformedPoint(0,0);
            var p2 = ctx.transformedPoint(canvas.width,canvas.height);
            ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

            const width = image.width;
            const height = image.height;
            const kof = width / height;
            const newWidth = 300 * kof;
            const newHeight = 300;
            const left = (canvas.width - newWidth) / 2;
            const right = (canvas.height - newHeight) / 2;

            ctx.drawImage(image, left, right, newWidth, newHeight);
            ctx.fillStyle = "blue";
        }
        redraw();    
        var lastX=canvas.width/2, lastY=canvas.height/2;
        var dragStart,dragged;
        canvasFrame.addEventListener('mousedown',function(evt){
            document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
            lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
            lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
            dragStart = ctx.transformedPoint(lastX,lastY);
            dragged = false;
        },false);
        canvasFrame.addEventListener('mousemove',function(evt){
            lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
            lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
            dragged = true;
            if (dragStart){
                var pt = ctx.transformedPoint(lastX,lastY);
                ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
                redraw();
            }
        },false);
        canvasFrame.addEventListener('mouseup',function(evt){
            dragStart = null;
            if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
        },false);

        var scaleFactor = 1.1;
        var zoom = function(clicks){
            var pt = ctx.transformedPoint(lastX,lastY);
            ctx.translate(pt.x,pt.y);
            var factor = Math.pow(scaleFactor,clicks);
            ctx.scale(factor,factor);
            ctx.translate(-pt.x,-pt.y);
            redraw();
        }
        let wheelDeltaBuffer = 0;
        var handleScroll = function(evt){
            var delta = evt.wheelDelta ? evt.wheelDelta/100 : evt.detail ? -evt.detail : 0;
            console.log(evt.wheelDelta, 'wheelDelta', wheelDeltaBuffer);
            if ((wheelDeltaBuffer <= 600) && (wheelDeltaBuffer >= -600)) {
                if (
                    (wheelDeltaBuffer !== 600 || (evt.wheelDelta < 150))
                    &&
                    (wheelDeltaBuffer !== -600 || (evt.wheelDelta > -150))
                    ) {
                    if (delta) zoom(delta);
                    wheelDeltaBuffer += evt.wheelDelta;
                }
            }
            return evt.preventDefault() && false;
        };
        canvasFrame.addEventListener('DOMMouseScroll',handleScroll,false);
        canvasFrame.addEventListener('mousewheel',handleScroll,false);
        function trackTransforms(ctx){
            var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
            var xform = svg.createSVGMatrix();
            ctx.getTransform = function(){ return xform; };
            
            var savedTransforms = [];
            var save = ctx.save;
            ctx.save = function(){
                savedTransforms.push(xform.translate(0,0));
                return save.call(ctx);
            };
            var restore = ctx.restore;
            ctx.restore = function(){
                xform = savedTransforms.pop();
                return restore.call(ctx);
            };
    
            var scale = ctx.scale;
            ctx.scale = function(sx,sy){
                xform = xform.scaleNonUniform(sx,sy);
                return scale.call(ctx,sx,sy);
            };
            var rotate = ctx.rotate;
            ctx.rotate = function(radians){
                xform = xform.rotate(radians*180/Math.PI);
                return rotate.call(ctx,radians);
            };
            var translate = ctx.translate;
            ctx.translate = function(dx,dy){
                xform = xform.translate(dx,dy);
                return translate.call(ctx,dx,dy);
            };
            var transform = ctx.transform;
            ctx.transform = function(a,b,c,d,e,f){
                var m2 = svg.createSVGMatrix();
                m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
                xform = xform.multiply(m2);
                return transform.call(ctx,a,b,c,d,e,f);
            };
            var setTransform = ctx.setTransform;
            ctx.setTransform = function(a,b,c,d,e,f){
                xform.a = a;
                xform.b = b;
                xform.c = c;
                xform.d = d;
                xform.e = e;
                xform.f = f;
                return setTransform.call(ctx,a,b,c,d,e,f);
            };
            var pt  = svg.createSVGPoint();
            ctx.transformedPoint = function(x,y){
                pt.x=x; pt.y=y;
                return pt.matrixTransform(xform.inverse());
            }
        }
}
 
export default handlerCropAndMoveImage;