# TeamTasks

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## היסטוריית תיקונים ופתרון תקלות (Troubleshooting & Fixes)

להלן סיכום הבעיות שנמצאו והתיקונים שבוצעו כדי לייצב את המערכת:

### 1. בעיות אימות (Auth Authorization)
*   **הבעיה**: קבלת שגיאות `401 Unauthorized` בכל הבקשות לשרת.
*   **הגורם**: הלוגיקה ב-`auth.interceptor` הייתה הפוכה. התנאי בדק אם הבקשה *אינה* ל-auth והדליג על הוספת הטוקן, במקום ההפך.
*   **התיקון**: היפוך הלוגיקה כך שה-Header של האימות (`Authorization`) מתווסף לכל הבקשות שאינן ל-Login/Register.

### 2. נתיבי API שגויים (404 Not Found)
*   **הבעיה**: שגיאות `404` בעת טעינת צוותים.
*   **הגורם**: האפליקציה ניסתה לפנות לנתיב `/api/teams/me` שאינו קיים בשרת.
*   **התיקון**: שינוי הפנייה לנתיב הנכון `/api/teams`.

### 3. התנגשות אירועי DOM (Event Bubbling)
*   **הבעיה**: בעת יצירת פרויקט, התקבל אובייקט עם `isTrusted: true` במקום הנתונים של הטופס (שגיאת `400 Bad Request`).
*   **הגורם**: כפתור ה-Submit בטופס ירה אירוע `submit` טבעי של הדפדפן (Native DOM Event) שבעבע למעלה והתנגש עם ה-Output של האנגולר שנקרא גם הוא `submit`.
*   **התיקון**: שינוי שם ה-@Output בקומפוננטות (Dialogs) מ-`submit` לשמות ספציפיים כמו `createProject` ו-`createTeam` כדי למנוע בלבול עם אירועי דפדפן.

### 4. סנכרון ממשק משתמש וארכיטקטורה מודרנית (Modern Architecture & Signals)
*   **הבעיה**: בעיות בסנכרון התצוגה (Change Detection), אי-עדכון אוטומטי של רשימות, ושגיאות `NG0100` (שינוי ערכים בזמן רינדור).
*   **הפתרון הנבחר (Professional Approach)**: מעבר מלא לשימוש ב-**Angular Signals** (הסטנדרט בגרסאות 16+).
    *   **ViewModel Pattern**: איחוד כל המידע (נתונים, סטטוס טעינה, שגיאות) לאובייקט אחד (`state`).
    *   **toSignal**: המרת זרמי מידע (RxJS Observables) לסיגנלים יציבים, מה שמבטיח סנכרון מושלם ללא צורך ב-`subscribe` ידני.
    *   **OnPush Strategy**: שימוש באסטרטגיית זיהוי שינויים `ChangeDetectionStrategy.OnPush` לביצועים אופטימליים, כך שהתצוגה מתרעננת אך ורק כשהסיגנל משתנה.
    *   **התוצאה**: קוד נקי יותר, ביצועים טובים יותר, ומניעה מוחלטת של בעיות סנכרון ו-Race Conditions.
