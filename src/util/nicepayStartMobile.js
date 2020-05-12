//스마트폰 결제 요청
function goPay(form) {
    document.charset = "euc-kr";
    document.getElementById("vExp").value = getTomorrow();
    document.tranMgr.submit();
}
//가상계좌 입금만료일 설정 (today +1)
function getTomorrow(){
    var today = new Date();
    var yyyy = today.getFullYear().toString();
    var mm = (today.getMonth()+1).toString();
    var dd = (today.getDate()+1).toString();
    if(mm.length < 2){mm = '0' + mm;}
    if(dd.length < 2){dd = '0' + dd;}
    return (yyyy + mm + dd);
}

function fnPopup(){
    let res = window.open('', 'popupChk', 'width=500, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');

    if(res === null){
        alert('본인인증을 위해 해당 사이트의 팝업을 허용해 주시기 바랍니다.');
    }

    document.form_chk.action = "";
    document.form_chk.target = "popupChk";
    document.form_chk.submit();


}

function idVerified() {
    let idButtonText = document.getElementById("idButtonTextID");
    idButtonText.innerText = "인증완료";

    alert('본인 인증이 완료되었습니다.')
}