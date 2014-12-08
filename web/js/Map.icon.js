Map.icon={
	FLAG:function(ctx,opt){
		var w=ctx.canvas.width;
		var h=ctx.canvas.height;
		//icon
		ctx.font=h+'px sans-serif';
		ctx.fillStyle=opt.color;
		ctx.textAlign='left';
		ctx.textBaseline='top';
		ctx.fillText('\u2691',0,h/8);
		//label
		ctx.font='9px sans-serif';
		ctx.fillStyle="#000";
		ctx.textAlign='center';
		ctx.fillText(opt.label,w/2.3,h/3);
	},
	LABEL:function(ctx,opt){
		var w=ctx.canvas.width;
		var h=ctx.canvas.height;
		ctx.textAlign='center';
		ctx.textBaseline='top';
		//2+1 lines of text
		var p=opt.label.slice(opt.label.length/2-3).split(/[ -]/).slice(1).join(" ").length;
		function writeAt(ox,oy,color){
			ctx.fillStyle=color;
			ctx.font='16px sans-serif';
			ctx.fillText(opt.label.slice(0, opt.label.length-p),w/2+ox, 0+1+oy,w-2);
			ctx.fillText(opt.label.slice(opt.label.length-p)   ,w/2+ox,16  +oy,w-2);
			ctx.font='11px sans-serif';
			ctx.fillText(opt.sub,w/2+ox,32+1+oy,w-2);
		}
		ctx.shadowColor = opt.shadowColor||"#000"
		ctx.shadowBlur = opt.shadowSize||2;
		for(var i=0;i<5;i++)
			writeAt( 0, 0,ctx.shadowColor)
		
		ctx.shadowBlur = 0;
		writeAt( 0, 0,opt.color||"#FFF")
	},
	getIcon:function(func,opt){
		var cnv = document.createElement('canvas');
		var ctx=cnv.getContext("2d");
		for(var o in opt)cnv[o]=opt[o];
		func(ctx,opt);
		return {
			url:cnv.toDataURL(),
			size: new google.maps.Size(opt.width,opt.height),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(opt.width*(opt.left||0.5),opt.height*(opt.top||1)),
		};
	},
}