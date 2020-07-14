//function sleep(milliseconds) {
//  const date = Date.now();
//  let currentDate = null;
//  do {
//    currentDate = Date.now();
//  } while (currentDate - date < milliseconds);
//}
//$(".faded").each(function(i) {
//    if(i==0)
//    {
//        $(this).delay(1000).fadeIn(1000);
//        sleep(1300);
//    }
//    else{
//            $(this).delay(400).fadeIn(1000);
//    }
//
//});
function validate_radio_options(options)
{
    var checked_options=0;
    for(var i=0; i<options.length; i++)
        {
            var input_tag = options[i].querySelector("input");
            if(input_tag.checked)
                checked_options++;
        }
     return (checked_options > 0);

}

function validate_check_options(options)
{
    var checked_options=0;
    for(var i=0; i<options.length; i++)
        {
            var input_tag = options[i].querySelector("input");
            if(input_tag.checked)
            {

                if(options[i].getAttribute("id").endsWith("other"))
                 {
//                    console.log(options[i].querySelector("textarea"));
                    if(options[i].querySelector("textarea").value === "")
                         {
                            checked_options = 0;
                            break;
                         }
                     else
                        checked_options++;
                 }
                else
                    checked_options++;
            }

        }
    return (checked_options > 0);
}

function get_checked_options(options)
{
    var answers = [];
    for(var i=0; i<options.length; i++)
    {
         var input_tag = options[i].querySelector("input");
            if(input_tag.checked)
            {
                if(options[i].getAttribute("id").endsWith("other"))
                    {
                       var other = "Other:";
                        other += options[i].querySelector("textarea").value;
                        answers.push(other);
                    }
                 else
                    answers.push(input_tag.parentElement.innerText);
            }
    }

    return answers;
}

function validate_fields()
{

    toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "100",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
    }

// Get the children of the main div which holds all questions (i.e all the major question divs)
var q_divs = document.querySelector('#questions-container').children;

// Maintain question to answer mapping

var qs_ans = [];
var q_and_ans_dict = {};
var answers = [];
var error = false;
// Check if all required fields are filled
// Iterate through all the major question divs
for(var i=0; i< q_divs.length; i++)
    {
        answers = [];
        // question_div contains the div with the question
        var question_div = q_divs[i].querySelector("#Q"+(i+1)+"-question");
        var q_num = q_divs[i].getAttribute("id").split(":")[0];
        var q_type = q_divs[i].getAttribute("id").split(":")[1];

        // Get question
        var question = question_div.querySelector("p").textContent.trim();

//        q_and_ans_dict["Question_number"] = q_num;
//        q_and_ans_dict[question.trim()] = [];
//        q_and_ans_dict["Type"] = q_type;

//        console.log(question_div);

        var isChecked = false;
        var isRequired = question.indexOf("*") != -1;

        // Extract option divs for the question
        var options = q_divs[i].querySelector("#Q"+(i+1)+"-options").children;
        if(isRequired)
        {
                // If "required" text field is empty, then highlight box
                if(q_type == "Text" && options[0].querySelector("textarea").value === "")
                {
                    isChecked = false;
                }
                // If required textarea is not empty, then add to answers
                else if(q_type == "Text" && !options[0].querySelector("textarea").value === "")
                    answers.push(options[0].querySelector("textarea").value);

                // If "required" field is radio or check
                else
                {
                    if(q_type == "Radio")
                        var isValid = validate_radio_options(options);
                    else if(q_type == "Check")
                        var isValid = validate_check_options(options);
                }

                if(!isValid)
                    {
                       q_divs[i].style.border = "2px solid #ff6060";
                       error = true;
                    }
                 else
                 {
                    q_divs[i].style.border = "";
                    answers = get_checked_options(options);

                    q_and_ans_dict[question.substring(3,question.length-1)] = answers;
                 }
        }
        else
        {
            if(q_type == "Text")
                answers.push(options[0].querySelector("textarea").value);

            else if(q_type == "Radio" || q_type == "Check")
                answers = get_checked_options(options);

            q_and_ans_dict[question.substring(3,question.length)] = answers;
        }



    }
    qs_ans.push(q_and_ans_dict);
    console.log(qs_ans);
    if(error)
    {
        toastr.error('Please answer required questions','Error');
    }
    else
    {
        toastr.success('Your answers have been recorded!','Success');

        var qs_ans_json = JSON.stringify(qs_ans);
        var form_qa = document.forms["q_form"];
        form_qa.elements["json_data"].value = qs_ans_json;
        setTimeout(function(){toastr.clear();document.getElementById("q_form").submit();},
                    2500);
    }
}



$("[id$=-others]").on({

    click: function(){
        if ($(this).is(':checked'))
            {
                // show textarea
                $("#textarea-div").show();
            }
            else
            {
                // hide textarea
                $("#textarea-div").hide();
            }
    }
});




//$("[id$=-others]").on({click:,other_check(this){
//    console.log("Inside");
//    if ($(this).is(':checked'))
//    {
//        // show textarea
//        $("#textarea-div").show();
//    }
//    else
//    {
//        // hide textarea
//        $("#textarea-div").hide();
//    }
//});