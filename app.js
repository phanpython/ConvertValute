const express = require("express");
const requestAPI = require("request");


const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("view options", {layout:"layout"});

app.get("/",(request,response) => {
    const url = "https://www.cbr-xml-daily.ru/daily_json.js";
    requestAPI(url, (error,request2,data) =>{
        let model = {
            Valute:{}
        };

        let buf = {
            Valute: {}
        }
        let m = {
            Valute: {}
        }
        
        if(error) console.log(error);
        else {

            buf.Valute["RUS"] = {
                "ID": "R0",
                "NumCode": "0",
                "CharCode": "RUS",
                "Nominal": 1,
                "Name": "Российский рубль",
                "Value": 1,
                "Previous": 1
                };
            m = JSON.parse(data);
            model.Valute = Object.assign(buf.Valute,m.Valute);
            var i = 1;
            for (const key in model.Valute) { 
                    const element = model.Valute[key];
                    element.IdValute = i;
                    element.Value = Math.round((element.Value / element.Nominal) * 1000) / 1000;
                    element.DeValue = Math.round((1 /element.Value)*1000) / 1000;
                    i++;
            }
        }
        response.render("main",model);
    })
});

app.get("/*",(request,response) => {
    response.redirect("/");
});

app.listen(port, () => {
    console.log(`App is running http://localhost:${port}`);
});