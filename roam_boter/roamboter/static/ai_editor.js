    // first we need to create a stage
    var stage = new Konva.Stage({
        container: 'container',   // id of container <div>
        width: 500,
        height: 500
    });

    // then create layer
    var layer = new Konva.Layer();
    var templayer = new Konva.Layer();
    spacing = 40;
    line_height = 10;
    const circle_radius = 10;
    var inputDict = new Map([]);

    class condition {
        constructor() {
            this.height = spacing;

            //TODO: change
            this.width = 100;
            this.createGroup();
        }

        //creates the group which represents a condition
        createGroup() {
            this.group = new Konva.Group({
                draggable: true
            });
            this.createRect();
            this.createFalseCircle();
            this.createTrueCircle();
            this.createDragCircle(this.trueCircle, true);
            this.createDragCircle(this.falseCircle, false);
            this.createInputCircle();
            let node = this;
            this.group.on("dragmove", function(){
               node.updateArrows()
            });
        }

        updateArrows(){
            if(this.trueArrow != null){
                this.trueArrow.update();
            }
            if(this.falseArrow != null){
                this.falseArrow.update();
            }
            if(this.inputArrow != null){
                this.inputArrow.update();
            }
        }

        //circle to which connections can be made by dragging arrows on it
        createInputCircle(){
            this.inputCircle = new Konva.Circle({
                y: 0,
                x: this.rect.width() / 2,
                radius: circle_radius,
                fill: 'white',
                stroke: 'black',
            });
            inputDict.set(this.inputCircle, this);

            this.group.add(this.inputCircle);
        }

        //base rectangle which contains the condition text
        createRect(){
            this.rect = new Konva.Rect({
                x: 0,
                y: 0,
                width: this.width,
                height: this.height,
                fill: 'blue',
                stroke: 'black',
                strokeWidth: 2,
                cornerRadius: 10,
            });
            this.group.add(this.rect);
        }

        //create a circle from which the false connection is made to another node
        createFalseCircle(){
            this.falseCircle = new Konva.Circle({
                y: this.rect.height(),
                x: 0,
                radius: circle_radius,
                fill: 'red',
                stroke: 'black',
            });
            this.group.add(this.falseCircle);
        }

        //create a circle from which the true connection is made to another node
        createTrueCircle(){
            this.trueCircle = new Konva.Circle({
                y: this.rect.height(),
                x: this.rect.width(),
                radius: circle_radius,
                fill: 'green',
                stroke: 'black',
            });
            this.group.add(this.trueCircle);

        }

        //creates an invisible circle used only for making a new connection between nodes, based on condition will create one for true or for false
        createDragCircle(circle, condition){
            let dragCircle = new Konva.Circle({
                draggable: true,
                y: circle.y(),
                x: circle.x(),
                radius: circle_radius,
                fill: 'black',
                opacity: 0.5
            });
            if (condition) {
                this.trueDragCircle = dragCircle;
            } else {
                this.falseDragCircle = dragCircle;
            }

            this.group.add(dragCircle);

            dragCircle.originalX = dragCircle.x();
            dragCircle.originalY = dragCircle.y();

             //when the invisible circle starts to be dragged create a new temporary arrow
            dragCircle.on("dragstart", function(){
                this.tempX = this.getAbsolutePosition().x;
                this.tempY = this.getAbsolutePosition().y;
                //it is important that the invisible circle is in a different layer in order to check what is under the cursor it later
                this.moveTo(templayer);
                this.tempArrow = new Konva.Arrow({
                    stroke: "black",
                    fill: "black"
                });
                templayer.add(this.tempArrow);
            });

            //update the temporary arrow
            dragCircle.on("dragmove", function(){
                this.tempArrow.points([this.tempX, this.tempY, stage.getPointerPosition().x, stage.getPointerPosition().y]);
                templayer.draw();
            });
            let g = this.group;
            let node = this;
            //when the drag is enden return the invisible circle to its original position, remove the temporary arrow and create a new connection between nodes if applicable
            dragCircle.on("dragend", function(){
                var touchPos = stage.getPointerPosition();
                var intersect = layer.getIntersection(touchPos);
                console.log(intersect);
                console.log(inputDict[intersect]);
                //TODO: shit doen hier
                if (inputDict.has(intersect)){
                    new arrow(node, inputDict.get(intersect), condition);
                }


                this.moveTo(g);
                this.x(this.originalX);
                this.y(this.originalY);
                this.tempArrow.destroy();
                this.tempArrow = null;
                layer.draw();
                templayer.draw();
            });

        }

        getTrueDotPosition(){
            let pos = this.trueCircle.getAbsolutePosition();
            return [pos.x, pos.y];
        }

        getFalseDotPosition(){
            let pos = this.falseCircle.getAbsolutePosition();
            return [pos.x, pos.y];
        }

        getInputDotPosition(){
            let pos = this.inputCircle.getAbsolutePosition();
            return [pos.x, pos.y];
        }



    }
    //The connection between two conditions or a condition and an action
    class arrow {

        //The Konva arrow object
        arrowline;

        //The source/origin group of nodes (condition)
        src;

        //The destination group of nodes (condition/action)
        dest;

        //Whether the arrow sprouts from a true or false condition
        isTrue;

        //The starting coordinates on the canvas (absolute)//
        startpos;

        //The end coordinates on the canvas (absolute)
        endpos;

        //Constructor takes the source node, destination node and whether it starts at the true- or false point as input/
        constructor(src, dest, isTrue) {
            this.src = src;
            this.dest = dest;
            this.isTrue = isTrue;
            if(isTrue) {
                this.startpos = this.src.getTrueDotPosition();
                this.src.trueArrow = this;
            } else {
                this.startpos = this.src.getFalseDotPosition();
            }
            this.endpos = this.dest.getInputDotPosition();
            this.dest.inputArrow = this;

            this.arrowline = new Konva.Arrow({
                x: 0,
                y: 0,
                points: this.startpos.concat(this.endpos),
                stroke: 'black'
            });
            layer.add(this.arrowline);
            layer.draw();

        }


        //Move the arrow and update the canvas
        update() {
            if(this.isTrue) {
                this.startpos = this.src.getTrueDotPosition();
            } else {
                this.startpos = this.src.getFalseDotPosition();
            }
            this.endpos = this.dest.getInputDotPosition();

            this.arrowline.points(this.startpos.concat(this.endpos));
            layer.draw();

        }

        //Remove the arrow from the canvas and set the corresponding values at the src&dest nodes to null
        delete() {
            if(this.isTrue) {
                this.src.trueArrow = null;
            } else {
                this.src.falseArrow = null;
            }
            this.dest.inputArrow = null;
            this.arrowline.destroy();
            layer.draw();
        }
    }




    var node1 = new condition();
    var node2 = new condition();
    layer.add(node1.group);
    layer.add(node2.group);
    stage.add(layer);
    stage.add(templayer);

    layer.draw();
