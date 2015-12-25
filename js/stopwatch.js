
var app = angular.module('StopWatch',[]);
app.controller('stopwatchCtrl',['$scope','$timeout',function($scope,$timeout){
    $scope.stopWatches=[];
    var stopWatchConstructor=function(){
        var stopWatch={
            stopWatchObj:0,
            startTime:null,
            status:"init",
            laps:[],
            time:{
                mSec:0,
                sec:0,
                min:0,
                hr:0,
            },
			init:function(){
                this.time.mSec=this.time.sec=this.time.min=this.time.hr=0;
            },
            calculateTime:function(){
            var _this=this;
            this.stopWatchObj=$timeout(function() {
                var currentTime=new Date();
                var difference=currentTime-_this.startTime;
                _this.time=_this.timeFormatter(difference);
               _this.calculateTime(); 
            }, 50);
            },
            start:function(){
                this.startTime=new Date();
                this.calculateTime();
                this.status = "started";
            },
            reset:function(){
                this.startTime=null;
                this.init();
                this.laps=[];
                this.status = "init";
                this.stopWatchObj=0;
            },
            stop:function(index){
                $timeout.cancel(this.stopWatchObj);
				var data=[];
                this.status = "stopped";
				if (this.laps.length == 0) {
					console.error('No data');
					return;
				} else {
					filename = "laps-data-for-"+(index+1)+'.json';
					angular.forEach(this.laps, function(value, index){
						var tempSplitData = {};
						var hr = (value.totalDuration.hr < 10 ? "0"+value.totalDuration.hr : value.totalDuration.hr);
						var min = (value.totalDuration.min < 10 ? "0"+value.totalDuration.min : value.totalDuration.min);
						var sec = (value.totalDuration.sec < 10 ? "0"+value.totalDuration.sec : value.totalDuration.sec);
						var msec = (value.totalDuration.mSec < 10 ? "0"+value.totalDuration.mSec : value.totalDuration.mSec);
						tempSplitData.totalDuration = hr + ":" + min + ":" + sec + ":" + msec;
						hr = (value.lapDuration.hr < 10 ? "0"+value.lapDuration.hr : value.lapDuration.hr);
						min = (value.lapDuration.min < 10 ? "0"+value.lapDuration.min : value.lapDuration.min);
						sec = (value.lapDuration.sec < 10 ? "0"+value.lapDuration.sec : value.lapDuration.sec);
						msec = (value.lapDuration.mSec < 10 ? "0"+value.lapDuration.mSec : value.lapDuration.mSec);
						tempSplitData.lapDuration = hr + ":" + min + ":" + sec + ":" + msec;
						data.push(tempSplitData);
					});
				}
				if (typeof data === 'object') {
					data = JSON.stringify(data, undefined, 2);
				}
				var blob = new Blob([data], {type: 'text/json'});
				e = document.createEvent('MouseEvents');
				a = document.createElement('a');
				a.download = filename;
				a.href = window.URL.createObjectURL(blob);
				a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
				e.initMouseEvent('click', true, false, window,0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(e);
            },
            timeFormatter:function(difference){
                var time={};
                time.hr=Math.floor(difference/3600000);
                difference=difference%3600000;
                time.min=Math.floor(difference/60000);
                difference=difference%60000;
                time.sec=Math.floor(difference/1000);
                difference=difference%1000;
                time.mSec=Math.floor(difference/10);
                return time;
            },
            lap:function(){
                var currentTime=new Date();
                var prevLap=this.laps[this.laps.length-1];
                var tempLap={};
                tempLap.totalDurationInMilli=currentTime-this.startTime;
                tempLap.totalDuration=this.timeFormatter(tempLap.totalDurationInMilli);
                if(prevLap !=undefined)
                  {
                      tempLap.lapDuration=this.timeFormatter(tempLap.totalDurationInMilli-prevLap.totalDurationInMilli);
                  }
                else
                  { 
                      tempLap.lapDuration=this.timeFormatter(tempLap.totalDurationInMilli); 
                  }
                this.laps.push(tempLap);
            },
        }
        return stopWatch;
    }
  
    $scope.createStopWatch=function(){
          var myStopWatch=new stopWatchConstructor();
            $scope.stopWatches.push(myStopWatch);
    };
    
    $scope.createStopWatch();
    
}]);