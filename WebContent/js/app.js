var taskManagerModule = angular.module('taskManagerApp', ['ngAnimate']);

taskManagerModule.controller('taskManagerController', function ($scope,$http) {
	
	var urlBase="http://localhost:8080/TaskManagerApp";
	$scope.toggle=true;
	$scope.selection = [];
	$scope.statuses=['ACTIVE','COMPLETED'];
	$scope.priorities=['HIGH','LOW','MEDIUM'];
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	
	//get all tasks and display initially
	$http.get(urlBase+'/tasks').
    	success(function(data) {
	        $scope.tasks = data;
	        for(var i=0;i<$scope.tasks.length;i++){
	            if($scope.tasks[i].taskStatus=='COMPLETED'){
	           	 $scope.selection.push($scope.tasks[i].taskId);
	        }
	        }
    });
	
	//add a new task
	$scope.addTask = function addTask() {
		if($scope.taskName=="" || $scope.taskDesc=="" || $scope.taskPriority == "" || $scope.taskStatus == ""){
			alert("Insufficient Data! Please provide values for task name, description, priortiy and status");
		}
		else{
		 $http.post(urlBase + '/tasks/insert/' +$scope.taskName+'/'+$scope.taskDesc+'/'+$scope.taskPriority+'/'+$scope.taskStatus).
		  success(function(data) {
			 alert("Task added");
			 $scope.tasks = data;	
			 $scope.taskName="";
			 $scope.taskDesc="";
			 $scope.taskPriority="";
			 $scope.taskStatus="";
			 $scope.toggle='!toggle';			 
		    });
		}
	};
		
	// toggle selection for a given task by task id
	  $scope.toggleSelection = function toggleSelection(taskId) {
	    var idx = $scope.selection.indexOf(taskId);

	    // is currently selected
	    if (idx > -1) {
	      $http.post(urlBase + '/tasks/' +taskId+'/ACTIVE').
		  success(function(data) {
			 alert("Task unmarked");
			 $scope.tasks = data;		       
		    });
	      $scope.selection.splice(idx, 1);
	    }

	    // is newly selected
	    else {
	      $http.post(urlBase + '/tasks/' +taskId+'/COMPLETED').
		  success(function(data) {
			 alert("Task marked completed");
			 $scope.tasks = data;
		    });
	      $scope.selection.push(taskId);
	    }
	  };
	  
	
	// Archive Completed Tasks
	  $scope.archiveTasks = function archiveTasks() {
		  $http.post(urlBase + '/tasks/archive/' + $scope.selection).
		  success(function(data) {
			  $scope.tasks = data;
		       alert("Successfully Archived");
		    });
	  };
	
});

//Angularjs Directive for confirm dialog box
taskManagerModule.directive('ngConfirmClick', [
	function(){
         return {
             link: function (scope, element, attr) {
                 var msg = attr.ngConfirmClick || "Are you sure?";
                 var clickAction = attr.confirmedClick;
                 element.bind('click',function (event) {
                     if ( window.confirm(msg) ) {
                         scope.$eval(clickAction);
                     }
                 });
             }
         };
 }]);