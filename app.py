from flask import Flask, render_template, jsonify, request
import pandas as pd
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('myCCStarter.html')

@app.route('/myCCDashboard/getData', methods=['POST'])
def myCCDashboard():
    cardsData=pd.read_excel('./CCData.xlsx', sheet_name='Sheet1')
    print(cardsData.columns)
    cardsData['monthFormatted']=cardsData['Date'].dt.strftime('%b %Y')
    return jsonify({'html':render_template('myCCFinal.html'),'cardsData': cardsData.to_dict(orient='records')})

if __name__ == '__main__':
    app.run(debug=True)