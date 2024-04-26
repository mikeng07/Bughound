
from io import BytesIO
from flask import Flask, render_template, request, redirect, session, url_for, flash, send_file, make_response
from xml.etree.ElementTree import Element, SubElement, ElementTree
import pymysql.cursors
import hashlib

# set: should debug? (production)
debugVal = False

# app configuration
app = Flask(__name__)
app.secret_key = "cs544_pain"

# db configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'db': 'dbbughound',
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor
}


# helper functions
def verify_login():
    if "loggedin" not in session or 'loggedIn' in session is False:
         print('not logged in')
         message = f"You need to Login first"
         flash(message=message)
         return render_template('Login.html')

def verify_access():
    if session['user_level'] != 3:
        print('access not high enough')
        return render_template('index.html', access=session['user_level'], username=session['username'])

def get_all_MySQL_results(sql_list: str | list[str]):

    # result pile
    data = []

    connection = pymysql.connect(**db_config)
    with connection.cursor() as cursor:

        if type(sql_list) is str:
            print(sql_list, "is a string")
            cursor.execute(sql_list)
            data = cursor.fetchall()
            connection.commit()
            
        else:
            for sql in sql_list:
                # print(sql)
                cursor.execute(sql)
                data.append(cursor.fetchall())
                connection.commit()

    return data

def set_static_report_values():
    report_types = [
        'Coding Error', 'Design Issue', 'Hardware', 
        'Suggestion', 'Documentation', 'Query']

    severities = ['Mild','Infectious','Serious','Fatal']
    priority=[1,2,3,4,5,6]
    status=['Open', 'Closed', 'Resolved']
    resolution=['Pending', 'Fixed', 'Irreproducible', 
                'Deferred', 'As designed','Withdrawn by reporter', 
                'Need more info', 'Disagree with suggestion', 'Duplicate']
    resolution_version=[1,2,3,4]

    return report_types, severities, priority, status, resolution, resolution_version

# initial landing (Login)
@app.route("/")
def index():
    print("initial landing...")
    
    if 'username' in session and 'loggedIn' in session is True:
        print("welcome back")
        return redirect("/index")

    return render_template("Login.html")

#invoke login authentication
@app.route("/", methods=['POST', 'GET'])
def login_auth():

    print("making login request...")
    username = request.form['username']
    password = request.form['password']

    encoded_password = hashlib.sha256(bytes(password, "utf-8")).hexdigest()

    connection = pymysql.connect(**db_config)
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM Users WHERE user_name = %s', username)
        employee = cursor.fetchone()

        # print(employee)
        # print(encoded_password)

        if employee and employee['user_pass'] == encoded_password: # type:ignore
            session['loggedin'] = True
            session['username'] = username
            session['user_level'] = int(employee["user_access"])   # type:ignore

            print('login successful')
            return redirect('/homepage')
        
        else:
            print("incorrect username/password")
            message = f"Incorrect username or password"
            flash(message=message)
            return redirect('/')

# invoke logout
@app.route('/logout', methods=['POST','GET'])
def logout():
    print('making logout request...')

    if "loggedin" in session:
        message = f"You are Logged out Successfully"
        flash(message=message)
        session.clear()
    else:
        message = f"You need to Login first"
        flash(message=message)
    return redirect('/')


# homepage (index)
@app.route('/homepage', methods=["GET"])
def homepage():
    print('homepage...')
    print("session:", session.items())

    username = session['username']
    userlevel =session['user_level']
    #print("pp", username,userlevel)

    verify_login()

    return render_template('index.html', username=username, access=userlevel)


# maintenance page (main landing)
@app.route('/maintain_db')
def maintain_db():
    
    verify_access()
    verify_login()
    
    print('db maintenance...')
    return render_template('maintenancePage.html')

# manage employee page
@app.route('/manage_employees')
def manage_employees():
    username = session['username']
    userlevel= session['user_level']
    
    verify_access()
    verify_login()
    
    sql = 'SELECT * FROM users'
    data = get_all_MySQL_results(sql)
    print(data)
    return render_template('maintenancePage/employees.html', employees=data, username=username, userlevel=userlevel)

# manage program page
@app.route('/manage_programs')
def manage_programs():
    username = session['username']
    userlevel =session['user_level']
    
    verify_access()
    verify_login()
    
    sql = 'SELECT * FROM programs'
    data = get_all_MySQL_results(sql)
    print(data)
     
    return render_template('maintenancePage/programs.html', programs=data, username=username, userlevel=userlevel)

# manage area page
@app.route('/manage_areas')
def manage_areas():
    username = session['username']
    userlevel =session['user_level']
    
    verify_access()
    verify_login()
    
    # return render_template('maintenancePage/areas.html')
    
    sql_list = ['SELECT * FROM areas', 'SELECT * FROM programs', 'SELECT * FROM program_areas']
    areas, programs, program_areas = get_all_MySQL_results(sql_list)
    
    data = []
    
    print(areas)
    print(programs)
    print(program_areas)
    
    # for pa in program_areas:
    #     pi = pa['program_id']
    #     ai = pa['area_id']
    
    # return render_template('maintenancePage/areas.html', programs=programs)
    return render_template('maintenancePage/areas.html', program_areas=data, programs=programs, username=username, userlevel=userlevel)


## helper functions (maintenance parts) 
def insert_to_table(table, query_conditions, data, msg, msgVal=0, should_flash=True):
    
    stmt = "INSERT INTO "+ table +" "+ query_conditions
    
    connection = pymysql.connect(**db_config)
    with connection.cursor() as cursor:
            
        for n in range(len(data[0])):
            # get value n from each of the arrays in data
            values = [data[k][n] for k in range(len(data))]
            
            cursor.execute(stmt, values)
            connection.commit()
            id = cursor.lastrowid
            if should_flash:
                flash(msg.format(data[msgVal][n]))
    
        print("insert complete")    

def update_table(table, query_conditions, data, msg, msgVal=0, should_flash=True):
    
    stmt = "UPDATE "+ table +" SET "+ query_conditions
    
    connection = pymysql.connect(**db_config)
    with connection.cursor() as cursor:
        cursor.execute(stmt, data)
        connection.commit()
        if should_flash:
            flash(msg.format(data[msgVal]))
    
    print('update complete')
        
def remove_from_table(table, query_conditions, data, msg, msgVal=0, should_flash=True):
    
    stmt = "DELETE FROM "+ table +" WHERE "+ query_conditions
    
    connection = pymysql.connect(**db_config)
    with connection.cursor() as cursor:
        cursor.execute(stmt, data)
        connection.commit()
        if should_flash:
            flash(msg.format(data[msgVal]))
        
    print('remove complete')


# insert new employee (maintenancePage/employee)
@app.route('/insert', methods=['POST'])
def insert():
    verify_access()
    verify_login()
    
    employee_names = request.form.getlist("employee_name")
    usernames = request.form.getlist("username")
    employee_levels = request.form.getlist("employee_level")
    
    # default passwords (fill list to similar size)
    passwords = [hashlib.sha256(bytes("user", "utf-8")).hexdigest() for _ in range(len(employee_names))]
    
    data = [usernames, passwords, employee_names, employee_levels]
    conditions = "(user_name, user_pass, user_realname, user_access) VALUES (%s, %s, %s, %s)"
    msg = "Employee '{}' was successfully added."
    
    # insert
    insert_to_table(table="users", query_conditions=conditions, msg=msg, data=data, msgVal=2)
    
    return redirect(url_for('manage_employees'))

# update an employee
@app.route('/edit/<string:id_data>', methods=['POST'])
def edit(id_data):
    verify_access()
    verify_login()
            
    data = []
    conditions = []
    
    name = request.form['employee_name']
    if name != "":
        conditions.append("user_realname=%s")
        data.append(name)
    
    username = request.form['username']
    if username != "":
        conditions.append("user_name=%s")
        data.append(username)
    
    userlevel = request.form['employee_level']
    if userlevel != 0:
        conditions.append("user_access=%s")
        data.append(userlevel)
    
    if len(conditions) > 0:
        conditions = ','.join(conditions) + " WHERE user_id=%s"
        msg = "Employee id '{}' was successfully updated."
        data.append(id_data)
        
        # update
        update_table("users", conditions, data, msg, -1)
        
    return redirect(url_for('manage_employees'))
        

# delete an employee
@app.route('/delete/<string:id_data>', methods = ['GET'])
def delete(id_data):

    verify_access()
    verify_login()
    
    conditions = "user_id=%s"
    msg = "Employee with id '{}' was successfully deleted"
    
    remove_from_table("users", conditions, id_data, msg)
    return redirect(url_for('manage_employees'))


# add a program (maintenancePage/program)
@app.route('/add_program', methods=['POST']) #type:ignore
def add_program():

    verify_access()
    verify_login()
    
    if request.method == "POST":
        program = request.form.getlist('program_name')
        program_release = request.form.getlist('program_release')
        program_version = request.form.getlist('release_version')
        
        data = [program, program_release, program_version]
        conditions = "(program_name,program_version,release_version) VALUES (%s, %s, %s)"
        msg = "Program {} was successfully added."
        
        insert_to_table("programs", conditions, data, msg)
        
        return redirect(url_for('manage_programs'))

# edit a program
@app.route('/edit_program/<string:id_data>', methods=['POST']) #type:ignore
def edit_program(id_data):
    verify_access()
    verify_login()
        
    data = []
    conditions = []
    
    program = request.form['program_name']
    if program != "":
        conditions.append("program=%s")
        data.append(program)
    
    program_release = request.form['program_release']
    if program_release != "":
        conditions.append("program_version=%s")
        data.append(program_release)
    
    release_version = request.form['release_version']
    if release_version != "":
        conditions.append("release_version=%s")
        data.append(release_version)
    
    print(program, program_release, release_version)
    
    if len(conditions) > 0:
        conditions = ",".join(conditions) + " WHERE program_id=%s"
        msg = "Program with id '{}' was successfully updated."
        data.append(id_data)
        
        update_table("programs", conditions, data, msg, -1)
    
    return redirect(url_for('manage_programs'))

# delete a program
@app.route('/delete_program/<string:id_data>', methods = ['GET'])
def delete_program(id_data):

    verify_access()
    verify_login()
    
    connection = pymysql.connect(**db_config)
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM programs WHERE prog_id=%s", (id_data,))
        
        connection.commit()
        message=f"Program with id {id_data} was successfully deleted"
    
        flash(message=message)
        return redirect(url_for('manage_program'))


# add an area (maintenancePage/area)
@app.route('/add_area', methods=['POST']) #type:ignore
def add_area():

    verify_access()
    verify_login()
    
    if request.method == "POST":
        areas = request.form.getlist('area_title')
        prog_id = request.form['program_list']
        
        skip = False
        
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM programs")
            result = cursor.fetchone()
            print(result['COUNT(*)']) #type:ignore
            connection.commit()
            '''
            cursor.execute("SELECT prog_id FROM programs where program=%s",(program,))
            prog_id = cursor.fetchone()
            print(prog_id)
            '''

            if result['COUNT(*)'] == 0: #type:ignore
                flash("Cannot add area - programs table is empty.")
                skip = True
            else:
                pass
        
        if not skip:
            print(areas, prog_id)            
            conditions = "(area,prog_id) VALUES (%s, %s)"
            prog_id_list = [prog_id for _ in range(len(areas))]
            msg = "Area '%s' was successfully added."
        
        insert_to_table("areas", conditions, [areas, prog_id_list], msg)

        return redirect(url_for('manage_areas'))

# edit an area 
@app.route('/edit_area', methods=['POST','GET']) #type:ignore
def edit_area():

    verify_access()
    verify_login()
    
    if request.method == "POST":
        prog_id = request.form['prog_id']
        area = request.form['area']
        area_id = request.form['area_id']
               
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            cursor.execute("UPDATE areas SET area=%s, prog_id=%s WHERE area_id=%s", (area,prog_id, area_id))
            connection.commit()
            
            message = f"Areas {area} was successfully updated."
       
        flash(message=message)
        return redirect(url_for('manage_area'))

# delete an area
@app.route('/delete_area/<string:id_data>', methods = ['GET'])
def delete_area(id_data):

    verify_access()
    verify_login()
    
    connection = pymysql.connect(**db_config)
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM areas WHERE area_id=%s", (id_data,))
        
        connection.commit()
        message=f"Area with id {id_data} was successfully deleted"
    
        flash(message=message)
        return redirect(url_for('manage_area'))


# updateBug.html --------------------------------
@app.route('/update_bug')
def update_bug():
    username = session['username']
    userlevel =session['user_level']

    verify_login()
    
    sql_list = ['SELECT * FROM bugs', 'SELECT * FROM programs', 'SELECT * FROM areas', 'SELECT * FROM users']

    data, programs, areas, employees = get_all_MySQL_results(sql_list)
    print(data)

    report_types, severities, priority, status, resolution, resolution_version = set_static_report_values()
    
    return render_template('editBug.html',username=username,userlevel=userlevel, bugs=data, programs=programs, report_types=report_types, severities=severities, employees=employees, areas=areas, resolution=resolution, resolution_version=resolution_version, priority=priority, status=status)

# delete a bug
@app.route('/delete_bug/<string:id_data>', methods = ['GET'])
def delete_bug(id_data):

    verify_login()
    
    connection = pymysql.connect(**db_config)
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM bug WHERE bug_id=%s", (id_data,))
        
        connection.commit()
        message=f"Bug with id {id_data} was successfully deleted"
    
        flash(message=message)
        return redirect(url_for('update_bug'))

# edit a bug
@app.route('/edit_bug', methods=['POST','GET']) #type:ignore
def edit_bug():
    
    verify_login()
    
    if request.method == "POST":
        print(request.form)
        bug_id = request.form.get('bug_id')
        
        program = request.form.get('program')
        report_type = request.form.get('report_type')
        severity = request.form.get('severity')
        problem_summary = request.form.get('problem_summary')
        reproducible = request.form.get('reproducible')
        problem = request.form.get('problem')
        reported_by = request.form.get('reported_by')
        date_reported = request.form.get('date_reported')
        functional_area = request.form.get('functional_area')
        assigned_to = request.form.get('assigned_to')
        comments = request.form.get('comments')
        status = request.form.get('status')
        priority = request.form.get('priority')
        resolution = request.form.get('resolution')
        resolution_version = request.form.get('resolution_version')
        resolution_by = request.form.get('resolution_by')
        date_resolved = request.form.get('date_resolved')
        tested_by = request.form.get('tested_by')
        
        # Get the file attachment from the form
        attachment = request.files["attachment"]
        # Get the filename of the attachment
        file_name = attachment.filename

        # Read the contents of the file
        attachment = attachment.read()
        
    
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            cursor.execute("SELECT prog_id FROM programs WHERE program=%s", (program,))
            prog_id = cursor.fetchone()
        
            connection.commit()

            cursor.execute("SELECT area_id FROM areas WHERE area=%s", (functional_area,))
            area_id = cursor.fetchone()
        
            connection.commit()
            print("UPDATE bug SET program=%s, report_type=%s, severity=%s, problem_summary=%s, reproducible=%s, problem=%s, reported_by=%s, date_reported=%s, functional_area=%s, assigned_to=%s, comments=%s, status=%s, priority=%s, resolution=%s, resolution_version=%s, resolution_by=%s, date_resolved=%s, tested_by=%s, prog_id=%s, area_id=%s, attachment=%s, filename=%s WHERE bug_id=%s", (program, report_type, severity, 
                                            problem_summary, reproducible, problem, reported_by, 
                                            date_reported, functional_area, assigned_to, comments, 
                                            status, priority, resolution, resolution_version, resolution_by,
                                            date_resolved, tested_by, prog_id['prog_id'], area_id['area_id'], attachment, file_name, bug_id)) #type:ignore
            cursor.execute("UPDATE bug SET program=%s, report_type=%s, severity=%s, problem_summary=%s, reproducible=%s, problem=%s, reported_by=%s, date_reported=%s, functional_area=%s, assigned_to=%s, comments=%s, status=%s, priority=%s, resolution=%s, resolution_version=%s, resolution_by=%s, date_resolved=%s, tested_by=%s, prog_id=%s, area_id=%s, attachment=%s, filename=%s WHERE bug_id=%s", (program, report_type, severity, 
                                            problem_summary, reproducible, problem, reported_by, 
                                            date_reported, functional_area, assigned_to, comments, 
                                            status, priority, resolution, resolution_version, resolution_by,
                                            date_resolved, tested_by, prog_id['prog_id'], area_id['area_id'], attachment,file_name, bug_id)) #type:ignore
            connection.commit()
            
            message = f"Bug with name {program} was successfully updated."
        
        flash(message=message)
        return redirect(url_for('update_bug'))


# addBug.html ------------------------------
@app.route('/add_bug', methods=['GET', 'POST'])
def add_bug():
    username = session['username']
    userlevel =session['user_level']
    
    verify_login()
    
    if request.method == 'POST':
        program = request.form.get('program')
        report_type = request.form.get('report_type')
        severity = request.form.get('severity')
        reproducible = request.form.get('reproducible')
        problem = request.form.get('problem')
        problem_summary = request.form.get('problem_summary')
        suggested_fix = request.form.get("suggested_fix")
        reported_by = request.form.get('reported_by')
        date_reported = request.form.get('date_reported')
        
        # Get the file attachment from the form
        attachment = request.files["attachment"]
        # Get the filename of the attachment
        file_name = attachment.filename

        # Read the contents of the file
        attachment = attachment.read()
        
        
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            

            cursor.execute("SELECT prog_id FROM programs WHERE program=%s", (program,))
            prog_id = cursor.fetchone()
        
            connection.commit()

            cursor.execute("SELECT area_id FROM areas WHERE area=%s", (functional_area,))
            area_id = cursor.fetchone()
        
            connection.commit()

            
            print("INSERT INTO bugs (program, report_type, severity, problem_summary, reproducible, problem, reported_by, date_reported, functional_area, assigned_to, comments, status, priority, resolution, resolution_version, resolution_by,date_resolved, tested_by, prog_id, area_id, attachment, filename) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s)", 
                (program, report_type, severity, 
                 problem_summary, reproducible, problem, reported_by, 
                 date_reported, functional_area, assigned_to, comments, 
                 status, priority, resolution, resolution_version, resolved_by,
                 date_resolved, tested_by, prog_id['prog_id'], area_id['area_id'],  attachment, file_name)) #type:ignore
            cursor.execute("INSERT INTO bugs (program, report_type, severity, problem_summary, reproducible, problem, reported_by, date_reported, functional_area, assigned_to, comments, status, priority, resolution, resolution_version, resolution_by,date_resolved, tested_by, prog_id, area_id, attachment, filename) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s)", 
                (program, report_type, severity, 
                 problem_summary, reproducible, problem, reported_by, 
                 date_reported, functional_area, assigned_to, comments, 
                 status, priority, resolution, resolution_version, resolved_by,
                 date_resolved, tested_by, prog_id['prog_id'], area_id['area_id'],  attachment, file_name)) #type:ignore
            connection.commit()
            
            bug_id= cursor.lastrowid
            message = f"Bug with id {bug_id} was successfully added."
        
        
        # process the form data and store it in the database using PL/SQL
        
        # redirect to a success page
        flash(message=message)
        return redirect(url_for('add_bug'))


    sql_list = ['SELECT * FROM programs', 'SELECT * FROM areas', 'SELECT * FROM users']
    programs, areas, employees = get_all_MySQL_results(sql_list)
    print(programs)
    print(areas)
    print(employees)
    
    # if the request method is GET, render the add_bug page with the necessary form data
    report_types, severities, priority, status, resolution, resolution_version = set_static_report_values()

    return render_template('addBug.html', programs=programs, report_types=report_types, severities=severities, employees=employees, areas=areas, resolution=resolution, resolution_version=resolution_version, priority=priority, status=status, username=username, userlevel=userlevel)


# @app.route('/update',methods=['POST','GET'])
# def update():
#     verify_access()
#     verify_login()
#     return redirect(url_for('manage_employee'))


# searchBug ------------------------------
@app.route('/search_bug', methods=['GET', 'POST'])
def search_bug():
    username = session['username']
    userlevel =session['user_level']

    verify_login()

    sql_list = ['SELECT * FROM programs','SELECT * FROM areas','SELECT * FROM users']
    
    if request.method == 'POST':
        field_values={
        'program': request.form.get('program'),
        'report_type': request.form.get('report_type'),
        'severity': request.form.get('severity'),
        'problem_summary': request.form.get('problem_summary'),
        'reproducible': request.form.get('reproducible'),
        'problem': request.form.get('problem'),
        'reported_by': request.form.get('reported_by'),
        'date_reported': request.form.get('date_reported'),
        'functional_area': request.form.get('functional_area'),
        'assigned_to': request.form.get('assigned_to'),
        'comments': request.form.get('comments'),
        'status': request.form.get('status'),
        'priority': request.form.get('priority'),
        'resolution': request.form.get('resolution'),
        'resolution_version': request.form.get('resolution_version'),
        'resolution_by': request.form.get('resolution_by'),
        'date_resolved': request.form.get('date_resolved'),
        'tested_by': request.form.get('tested_by')
        }

        print(field_values)
        if field_values['date_reported']=='':
            field_values['date_reported']=None

        # build the SQL query based on user inputs
        sql = "SELECT * FROM bugs"
        conditions = []
        for field, value in field_values.items():
            if value!=None:
                conditions.append(f"{field} = '{value}'")
            
        if conditions:
            sql += " WHERE " + " AND ".join(conditions)
       
        sql_list.append(sql)
        programs, areas, employees, search_result = get_all_MySQL_results(sql_list)

        # if the request method is GET, render the add_bug page with the necessary form data
        report_types, severities, priority, status, resolution, resolution_version = set_static_report_values()
       
        # process the form data and store it in the database using PL/SQL
        
        # redirect to a success page
        return render_template('search_bug_result.html', result=search_result, username=username, userlevel=userlevel,programs=programs, report_types=report_types, severities=severities, employees=employees, areas=areas, resolution=resolution, resolution_version=resolution_version, priority=priority, status=status)
    
    programs, areas, employees = get_all_MySQL_results(sql_list)
    
    # if the request method is GET, render the add_bug page with the necessary form data
    report_types, severities, priority, status, resolution, resolution_version = set_static_report_values()

    return render_template('searchBug.html', programs=programs, report_types=report_types, severities=severities, employees=employees, areas=areas, resolution=resolution, resolution_version=resolution_version, priority=priority, status=status, username=username, userlevel=userlevel)

# view attachments
@app.route("/view_attachment/<string:filename>")
def view_attachment(filename):
    connection = pymysql.connect(**db_config)
    with connection.cursor() as cursor:
        cursor.execute("SELECT attachment FROM bug WHERE filename = %s", (filename,))
        data = cursor.fetchone()
        print(data)
        
    return send_file(BytesIO(data['attachment']), attachment_filename=filename, as_attachment=True) #type:ignore

# export data
@app.route('/export_data', methods=['GET', 'POST'])
def export_data():
    username = session['username']
    userlevel =session['user_level']
    
    verify_access()
    verify_login()
    
    if request.method == 'POST':
        table_name = request.form['table_name']
        data_type = request.form['data_type']
        connection = pymysql.connect(**db_config)
        with connection.cursor() as cursor:
            
            cursor.execute(f'SELECT * FROM {table_name}')
            rows = cursor.fetchall()
            # create a root element for the XML file
            root = Element(table_name)
            
            # iterate over the rows and create subelements for each record
            for row in rows:
                record = SubElement(root, "record")
                for key, value in row.items(): #type:ignore
                    field = SubElement(record, key)
                    field.text = str(value)
            
            # generate the XML file and save it to disk
            tree = ElementTree(root)
            if data_type == "xml":
                tree.write(f"{table_name}.xml", encoding="utf-8", xml_declaration=True)
            elif data_type == "ascii":
                with open(f"{table_name}.txt", "w") as f:
                    for row in rows:
                        for key, value in row.items(): #type:ignore
                            f.write(f"{key}: {value}\n")
                        f.write("\n")
            else:
                print("Invalid data type")
            
            # close the database connection
            cursor.close()
            connection.close()
            message = f"Table {table_name} with type {data_type} was successfully exported."
            flash(message=message)
            return redirect(url_for('export_data'))


    return render_template('export_data.html', username=username, userlevel=userlevel)


# automatic
if __name__ == "__main__":
    app.run(debug=debugVal, host='localhost', )
