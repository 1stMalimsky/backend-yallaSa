module.exports = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      direction: rtl; /* Ensures full RTL support */
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      margin: 20px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      direction: rtl; /* Ensures correct text flow */
      text-align: right; /* Aligns all text to the right */
    }
    h2 {
      color: #d9534f;
      text-align: center; /* Keeps title centered */
    }
    p {
      font-size: 16px;
      color: #333;
      line-height: 1.6;
    }
    .button-container {
      text-align: center; /* Keeps button centered */
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #d9534f;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      border-radius: 5px;
      text-align: center;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #888;
      margin-top: 20px;
    }
  </style>
</head>
<body>

  <div class="container">
    <h2>בקשת ביטול התקבלה</h2>
    <p>שלום {{name}},</p>
    <p>קיבלנו בקשה לביטול ההזמנה שלך ביאללה סע!</p>
    <p>אם זו הייתה טעות או שתרצה לדון באפשרויות אחרות, אנא צור קשר בהקדם האפשרי.</p>

    <!-- Centered button inside div -->
    <div class="button-container">
      <a href="https://www.microsoft.com" target="_blank" class="button">🛠 צור קשר עם התמיכה</a>
    </div>

    <p>אם הביטול זכאי להחזר, הוא יעובד בהתאם למדיניות ההחזרים שלנו תוך <strong>[Refund Timeframe]</strong>.</p>
    <p>תודה על בחירתך בנו, נשמח לשרת אותך בעתיד!</p>
    
    <div class="footer">
      <p>&copy; יאללה סע | <a href="http://127.0.0.1:3000/">לאתר שלנו</a></p>
    </div>
  </div>

</body>
</html>`;
