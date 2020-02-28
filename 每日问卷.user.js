// ==UserScript==
// @name         每日问卷
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.wjx.top/m/55361383.aspx
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    var date = new Date();
    var month = date.getDate();
    const info=[
        ["2020-02-"+month,/(请选择日期)/,/(今天)/],
        ["XXX",/(姓名)/],
        ["xxxxxxxxxx",/(请输入您的手机号)/],
        ["单选框",/(班级)/,/(计科170X)/],
        ["单选框",/现在是否在家？（不在常住地即为不在家）/,/(是)/],
        ["单选框",/有无感冒发热、干咳、乏力等症状/,/(无)/],
        ["单选框",/有无被隔离/,/(无)/],
        ["单选框",/有无疑似症状/,/(无)/],
        ["单选框",/有无被确诊/,/(无)/],
        ["单选框",/身体有无其他不适情况？/,/(无)/],
        ["单选框",/最近两周是否外出？（离开当前居住地，若是请填写具体行程）/,/(无)/],
        ["单选框",/家中有无疑似或确诊病例/,/(无)/],
        ["单选框",/自己当前身体状况（如选择其他，请详细填写身体状况）/,/(健康)/],
        ["单选框",/家人当前的身体状况（如选择其他，请详细填写家人身体状况）/,/(均健康)/],
        ["多选框",/我们关心你现在的情绪状态。下面哪些词语描述了你现在的情绪状态/,/(平静)/]
    ];
    const ini={
        module:".field.ui-field-contain",//每个问题模块
        title:".field-label",//标题
        type:{                              //key对应别名，value对应html的节点
           "input_text":".ui-input-text",
           "radio":".ui-radio",
           "checkbox":".ui-checkbox"
        }
    };

    $(document).ready(function(){
        var localBtn = document.getElementsByClassName("getLocalBtn");
        localBtn[0].click();
        console.log(localBtn);

        setTimeout(function(){
            var iframe=document.getElementById("yz_popwinIframe");
            var iDoc=iframe.contentDocument;
            var button = iDoc.querySelector(".ensure_btn");
            var add= iDoc.getElementById("iAddress");
            add.innerText="YOURADDRESS";
            button.click();
        }, 2000);

        let itemNum = 0;
        $(ini.module).each(function(){
            itemNum += 1;
            let title=$(this).find(ini.title).text();
            console.log("each循环" + itemNum);
            //判断类别
            let count = 0 ;
            for(let i=0;i<info.length;i++){//匹配用户信息
                if(info[i][1].test(title)){//匹配到一处信息,判断答题框类型,加break！
                   for(let tp in ini.type){
                       let dom=$(this).find(ini.type[tp]);
                       if(dom.length>0){
                           switch(tp){
                               case "input_text":
                                   $("#q"+itemNum)[0].value = info[i][0]; //赋值
                                   break;
                                case "radio":
                                   $(this).find(".ui-radio").each(function(){
                                        if(info[i].length>=3&&info[i][2].test($(this).text())){
                                            var id=$(this).find('input').attr('id');
                                            $("#"+id).prop("checked",true);
                                        }
                                    });
                                    break;
                                case "checkbox":
                                    $(this).find(".ui-checkbox").each(function(){
                                       console.log("outsidebox" + count);
                                        if(info[i].length>=3&&info[i][2].test($(this).text())){
                                            var id=$(this).find('input').attr('id');
                                            $("#"+id).prop("checked",true);
                                        }
                                    });
                                    break;
                                default:console.log("ini.type中没有匹配"+tp+"的键值");
                           }
                           break;
                       }
                   }
                    break;
                }
            }
        });
       //$("#ctlNext")[0].click();
    });
})();
