//결제창 최초 요청시 실행됩니다.
function nicepayStart(){
    document.getElementById("vExp").value = getTomorrow();
    goPay(document.payForm);
}

//결제 최종 요청시 실행됩니다. <<'nicepaySubmit()' 이름 수정 불가능>>
function nicepaySubmit(){
    document.payForm.submit();
}

//결제창 종료 함수 <<'nicepayClose()' 이름 수정 불가능>>
function nicepayClose(){
    alert("결제가 취소 되었습니다");
    window.location.href = ""
}

//가상계좌입금만료일 설정 (today +1)
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