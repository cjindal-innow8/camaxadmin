import LOGOURL from '../../assets/images/logo.png'
export const rejectJobTemplate = (data) =>{
 const {reason} = data
try{
return (
   `
<!doctype html>
<html lang="en">
   <head>
      <!-- Required meta tags -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
     
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
      <!-- <title>verify Email</title> -->
      <style>
      </style>
   </head>
   <body style="background-color:#FFF1E8;font-family: 'Montserrat', sans-serif;">
      <table style="box-shadow: 0px 30px 60px #0000000d;
         border-radius: 10px;
         background-color: white;
         padding: 41px;
         max-width: 608px;
         height: 430px;
         width: 100%; text-align: center;
         margin: 0 auto;">
         <tr>
            <td><img src=${LOGOURL} style="    margin: 0px auto;
               display: table;
               margin-bottom: 40px;    height: 32px;
               width: 168px;"/></td>
         </tr>
         <tr>
            <td>
               <h6 style="font-size: 18px;line-height: 28px; font-weight: 600;    margin-top: 0;
                  margin-bottom: 29px;">Your Request for job has been rejected by CAMAX due to</h6>
                  <p>${reason} </p>
            </td>  
         </tr>
      </table>
   </body>
</html>`
)
}catch(err){

}
}

