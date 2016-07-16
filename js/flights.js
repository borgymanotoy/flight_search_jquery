        var populateFlights = function(){
            var origin = $('#txtOrigin').val();
            var destination = $('#txtDestination').val();
            var departureDate = $('#txtDepartureDate').val();
            var hasPR = false;
            var hasPQ = false;
            var has5J = false;

            $('input[type=checkbox]:checked').each(function(){
                if("PR" == $(this).val()) hasPR = true;
                if("PQ" == $(this).val()) hasPQ = true;
                if("5J" == $(this).val()) has5J = true;
            });

            if(!hasPR && !hasPQ && !has5J){
                showErrorMsg('Please select atleast one airline.')
            }
            else if(origin && destination && departureDate){
                searchFlights(origin, destination, departureDate, hasPR, has5J, hasPQ);
            }
            else {
               showErrorMsg('Please fill up search fields.')
               
            }
        };

        var showErrorMsg = function(msg){
            if(msg){
                $("#spnErrorMsg").html(msg);
                $("#dvErrorMsg").show();
            }
        };

        var hideErrorMsg = function(){
            $("#dvErrorMsg").hide();
        };

        var searchFlights = function(origin, destination, departureDate, hasPR, has5J, hasPQ){
            var url = 'http://121.96.242.61:8088/UniversalTicketing/searchOneWayFlights?origin=' + origin + '&destination=' + destination + '&departureDate=' + departureDate;
            if(hasPR) url += "&hasPR=true";
            if(has5J) url += "&has5J=true";
            if(hasPQ) url += "&hasPQ=true";

            url += '&callback=?';

            $.getJSON(url, function(json) {
                $('table#tblFlights tbody').empty();
                $('#selFlights option').not(':eq(0)').remove();
                $.each(json, function(idx, obj) {
                    var fCode = '';
                    var isFirst = true;
                    var totalPrice = obj.totalPerPax;

                    $.each(obj.flightSegments, function(ix, fs){
                        if(!isFirst) fCode += ' -> ';
                        fCode += fs.flightCode;

                        //Populate Table
                        var strHTML = "<tr><td>" + (isFirst ? obj.segmentsCount : '&nbsp;') + "</td><td>"+fs.flightCode+"</td><td>"+fs.departureStationLabel+"</td><td>"+fs.arrivalStationLabel+"</td><td>"+fs.departureSchedule+"</td><td>"+fs.arrivalSchedule+"</td><td>"+fs.flightDuration+"</td><td>"+fs.aircraftType+"</td><td>"+ (fs.lowestBookingClass ? fs.lowestBookingClass : '&nbsp;') + "</td><td>" + (isFirst ? 'PHP ' + totalPrice : '&nbsp;') +"</td></tr>";
                        $('table#tblFlights tbody').append(strHTML);
                        isFirst = false;
                    });

                    //Populate Dropdown
                    //$('#selFlights').append($('<option>').text(fCode).attr('value', idx));
                });
            });
        };