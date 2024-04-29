
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


# helper functions (client-side/general)
def verify_login():

    flag = False
    try:
        logged_in = session['loggedin']
        if logged_in is False:
            print('not logged in')
            flag = True
    except:
        print('loggedin NOT in session')
        flag = True
    
    if flag:   
        message = f"Not logged in"
        flash(message=message)
        return redirect("/logout")

def verify_user():
    flag = False
    try:
        user = session['username']
        print(user)
        
        with pymysql.connect(**db_config) as connection:
            with connection.cursor() as cursor:
                cursor.execute(f"SELECT 'COUNT(*)' FROM users WHERE user_name={user}")
                result = cursor.fetchone()
                print(result) # type:ignore
                connection.commit()

        if result['COUNT(*)'] == 0: #type:ignore
            print('no such username in database')
            flag = True
        
    except:
        print('username NOT in session')
        flag = True
    
    if flag:   
        message = f"No user found"
        flash(message=message)
        return redirect("/logout")
        
    return verify_login()

def verify_admin():
    flag = False
    
    try:
        userlevel = session['user_level']
        if userlevel != 3:
            print('access not high enough')
            flag = True
    except:
        print('userlevel NOT in session')
        flag = True
    
    if flag:
        flash('Restricted access')
        return redirect("/homepage")
        
    return verify_user()

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

def title(strings):
    for i, string in enumerate(strings):
        strings[i] = string.title()
    return strings

def encode_password(password, enc_type="sha256"):
    
    if enc_type == "sha256":
        return hashlib.sha256(bytes(password, "utf-8")).hexdigest()

    return hash(password)

## helper functions (table functions) 
def insert_to_table(table, query_conditions, data, msg="", msgVal=0, should_flash=True):
    
    stmt = " ".join(["INSERT INTO", table, query_conditions])
    
    with pymysql.connect(**db_config) as connection:
        with connection.cursor() as cursor:
                
            for n in range(len(data[0])):
                # get value n from each of the arrays in data
                
                values = [data[k][n] for k in range(len(data))]
                message = msg.format(data[msgVal][n]) 
                try:
                    cursor.execute(stmt, values)
                    connection.commit()
                    
                except:
                    message = "'{}' happens to be a dupe in table:{}".format(data[msgVal][n], table)
                finally:
                    if should_flash:
                        flash(message)
    
    print("insert complete")

def unique_area_insert(area):
    
    # verify if queried area already exists
    results = select_from_table(table="areas", selection="area_id", query_conditions="area_title=%s", data=[area])
    
    if len(results) == 0:
        # result does not exist, so we commit new addition to areas
        insert_to_table(table="areas", query_conditions="(area_title) VALUES (%s)", data=[area], should_flash=False)
        results = select_from_table(table="areas", selection="area_id", query_conditions="area_title=%s", data=[area])
    
    print(results)
    # return area_id of area
    return results[0]['area_id'] #type:ignore

def update_table(table, query_conditions, data, msg="", msgVal=0, should_flash=True):
    
    stmt = " ".join(["UPDATE", table, "SET", query_conditions])
    
    with pymysql.connect(**db_config) as connection:
        with connection.cursor() as cursor:
            cursor.execute(stmt, data)
            connection.commit()
            if should_flash:
                flash(msg.format(data[msgVal]))
    
    print('update complete')
        
def remove_from_table(table, query_conditions, data, msg="", msgVal=0, should_flash=True, selection=""):
    
    stmt = " ".join(["DELETE", selection, "FROM", table, "WHERE", query_conditions])
    
    with pymysql.connect(**db_config) as connection:
        with connection.cursor() as cursor:
            cursor.execute(stmt, data)
            connection.commit()
            if should_flash:
                flash(msg.format(data[msgVal]))
        
    print('remove complete')

def select_from_table(table, query_conditions="", data=None, selection="*", msg="", msgVal=0, should_flash=False):
    
    stmt = ["SELECT", selection, "FROM", table]
    if query_conditions != "":
        stmt.append("WHERE")
        stmt.append(query_conditions)
    stmt = " ".join(stmt)
        
    with pymysql.connect(**db_config) as connection:
        with connection.cursor() as cursor:
            if data is not None:
                cursor.execute(stmt, data)
            else:
                cursor.execute(stmt)

            results = cursor.fetchall()
                
            connection.commit()
            
            if should_flash and data is not None:
                flash(msg.format(data[msgVal]))
    
    return results

def get_all_table_results(sql_list: str | list[str]):

    # result pile
    data = []

    with pymysql.connect(**db_config) as connection:
        with connection.cursor() as cursor:

            if type(sql_list) is str:
                # print(sql_list, "is a string")
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


# initial landing (Login)
# on POST, invoke login authentication
@app.route("/", methods=['GET', 'POST'])
def index():

    if request.method == "POST":
        # invoke login authentication
        print("making login request...")
        username = request.form['username']
        password = request.form['password']

        encoded_password = encode_password(password)

        with pymysql.connect(**db_config) as connection:
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
    
    # default landing     
    print("initial landing...")
    
    if 'username' in session and 'loggedIn' in session is True:
        print("welcome back")
        return redirect("/index")

    return render_template("Login.html")

# invoke logout
@app.route('/logout', methods=['POST','GET', 'PUT'])
def logout():
    print('making logout request...')

    if "loggedin" in session:
        message = f"You have been logged out successfully"
        flash(message=message)
        session.clear()
    else:
        message = f"You need to log in first"
        flash(message=message)
    return redirect('/')

@app.route("/change_pwd", methods=["POST", "PUT"])
def change_password():
    
    username = request.form["pw_username"]  
    
    new_password = request.form['new_password']
    new_password2 = request.form["new_password2"]
    
    # verify that the new password is correct (since it's done twice)
    if new_password != new_password2:
        flash("Your new password didn't match twice. A reminder:")
        flash(f"new password: {new_password}")
        flash(f"new pwd (again): {new_password2}")
    
    else:        
        with pymysql.connect(**db_config) as connection:
            with connection.cursor() as cursor:
                cursor.execute('SELECT * FROM Users WHERE user_name = %s', username)
                employee = cursor.fetchone()
            
        if employee:
            
            # Security issue: DON'T actually do this off the rip
            # Have some OTHER kind of verification in place (an email, for example)
            
            conditions = "user_pass=%s WHERE user_id=%s"
            data = (encode_password(new_password), employee['user_id']) # type:ignore
            update_table(table="Users", query_conditions=conditions, data=data, should_flash=False)
            
            flash("Your password has been successfully changed (and don't try to forget it!)")
            flash(f'Your new password is: {new_password}')
            
        else:
            flash("Your username didn't match. You typed:")
            flash(f"Username: {username}")
    
    return redirect(url_for("/"))

# homepage (index)
@app.route('/homepage') # type:ignore
def homepage(): 
    
    try:
        userlevel =session['user_level']
        username = session['username']
    except: 
        return verify_user()
    
    print('homepage...')
    print("session:", session.items())
    
    return render_template('index.html', username=username, access=userlevel)


# maintenance page (main landing)
@app.route('/maintain_db') # type:ignore
def maintain_db():
    
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('db maintenance...')
    return render_template('maintenancePage.html', username=username, access=userlevel)

# manage employee page
@app.route('/manage_employees') # type:ignore
def manage_employees():
    
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('managing employees...')
    
    data = get_all_table_results('SELECT * FROM users')
    # print(data)
    return render_template('maintenancePage/employees.html', employees=data, username=username, userlevel=userlevel)

# manage program page
@app.route('/manage_programs') #type:ignore
def manage_programs():
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('managing programs...')
    
    data = get_all_table_results('SELECT * FROM programs')
    # print(data)
     
    return render_template('maintenancePage/programs.html', programs=data, username=username, userlevel=userlevel)

# manage area page
@app.route('/manage_areas')  # type:ignore
def manage_areas():
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('managing areas...')
        
    sql = [
      "SELECT * FROM programs",
      "SELECT * FROM areas",
      "SELECT * FROM ((program_areas INNER JOIN programs ON program_areas.program_id=programs.program_id) INNER JOIN areas ON program_areas.area_id=areas.area_id) ORDER BY programs.program_id, areas.area_id"
    ]
    
    programs, areas, data = get_all_table_results(sql)
    # print(data,'\n',programs)
    
    return render_template('maintenancePage/areas.html', program_areas=data, programs=programs, areas=areas, username=username, userlevel=userlevel)

# export db table in a certain file type
@app.route('/export_data', methods=['GET', 'POST'])  # type:ignore
def export_data():
        
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
        
    try:
        table_name = request.form['table_name']
        data_type = request.form['data_type']
        
        print(table_name, data_type)
        with pymysql.connect(**db_config) as connection:
            with connection.cursor() as cursor:
                
                cursor.execute(f'SELECT * FROM {table_name}')
                rows = cursor.fetchall()
                # create a root element for the XML file
                root = Element(table_name)
                
                print('executed sql')
                
                # iterate over the rows and create subelements for each record
                for row in rows:
                    record = SubElement(root, "record")
                    for key, value in row.items(): #type:ignore
                        field = SubElement(record, key)
                        field.text = str(value)
                
                print('iterated')
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
                
                print('made into file')
        
        message = f"Table '{table_name}' with type '{data_type}' was successfully exported."
    except:
        message = "File type has not been chosen."    
        
    flash(message=message)
    return redirect(url_for('maintain_db'))


# insert new employee (maintenancePage/employee)
@app.route('/insert', methods=['POST'])  # type:ignore
def insert():
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('adding employee...')
    
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
@app.route('/edit/<string:id_data>', methods=['POST', 'PUT']) # type:ignore
def edit(id_data):
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('editing employee...')
            
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
@app.route('/delete/<string:id_data>', methods = ['GET', 'DELETE'])  # type:ignore
def delete(id_data):

    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('deleting employee...')
    
    conditions = "user_id=%s"
    msg = "Employee with id '{}' was successfully deleted"
    
    remove_from_table("users", conditions, id_data, msg)
    return redirect(url_for('manage_employees'))


# add a program (maintenancePage/program)
@app.route('/add_program', methods=['POST']) #type:ignore
def add_program():

    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('adding program...')
    
    program = request.form.getlist('program_name')
    program_release = request.form.getlist('program_release')
    program_version = request.form.getlist('release_version')
    
    data = [program, program_release, program_version]
    conditions = "(program_name,program_version,release_version) VALUES (%s, %s, %s)"
    msg = "Program {} was successfully added."
    
    insert_to_table("programs", conditions, data, msg)
    
    return redirect(url_for('manage_programs'))

# edit a program
@app.route('/edit_program/<string:id_data>', methods=['POST', 'PUT']) # type:ignore
def edit_program(id_data):
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('editing program...')
        
    data = []
    conditions = []
    
    program = request.form['program_name']
    if program != "":
        conditions.append("program_name=%s")
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
@app.route('/delete_program/<string:id_data>', methods = ['GET', 'DELETE']) # type:ignore
def delete_program(id_data):

    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('deleting program...')
    
    conditions = "program_id=%s"
    msg = "Program with id '{}' was successfully deleted"
    remove_from_table("users", conditions, (id_data), msg)
    
    # kill from program_areas
    remove_from_table(table="program_areas", query_conditions="program_id=%s", data=(id_data), should_flash=False)
    
    flash(f"All areas related to Program with id '{id_data}' have been successfully removed")

    return redirect(url_for('manage_programs'))


# add an area (maintenancePage/area)
@app.route('/add_area', methods=['POST']) # type:ignore
def add_area():

    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('adding area...')
    
    skip = False # a flag
    areas = request.form.getlist('area_title')
    
    while "" in areas:
        areas.remove("")
    # print('areas:', areas)
    
    if len(areas) == 0:
        flash('No areas added: none were listed.')
    else:
        # add all areas
        insert_to_table(table="areas", query_conditions="(area_title) VALUES (%s)", data=[areas], should_flash=False)        
        
        try:
            prog_id = request.form['program_list']
            connection = pymysql.connect(**db_config)
            with connection.cursor() as cursor:
                # check if program exists
                cursor.execute(f"SELECT COUNT(*) FROM programs WHERE program_id={prog_id}")
                result = cursor.fetchone()
                print(result) #type:ignore
                connection.commit()

                if result['COUNT(*)'] == 0: #type:ignore
                    flash("Cannot add area - program does not exist.")
                    skip = True
                
            if skip == False:
                # commit to program_areas
                print(areas, '\n', prog_id)
                conditions = "(area_id, program_id) VALUES ((SELECT area_id from areas where area_title=%s), %s)"
                prog_id_list = [prog_id for _ in range(len(areas))]
                msg = "Area '{}' was successfully added."
                insert_to_table("program_areas", conditions, [areas, prog_id_list], msg)
        except:
            # request.form['program_list'] does not exist
            flash("Note: No program assigned to added areas.")

    return redirect(url_for('manage_areas'))

# edit a program-area connection
@app.route('/edit_program_area/<string:pa_id>', methods=['POST', 'PUT']) # type:ignore
def edit_program_area(pa_id):

    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('editing program-area relation...')
    
    row_prog_id = request.form['row_program_id']
    prog_id = request.form['program_list']
    
    if prog_id != row_prog_id:
        # update program_id in program_areas
        print('changing program')
        conditions = "program_id=%s WHERE pa_id=%s"
        msg = "Relationship of area has been changed to program with id '{}'"
        update_table("program_areas", conditions, (prog_id, pa_id), msg, 1)
    
    try:
        area = request.form['area_title']
    
        # update area name (make a new area entry if needed)
        print('changing area title')
        
        # get area_id of new area OR the existing area (user typed a dupe) 
        new_area_id = unique_area_insert(area)
        
        # update area_id in program_areas with new_area_id via pa_id
        conditions = "area_id=%s WHERE pa_id=%s"
        msg = "Area was successfully updated to id '{}'"
        update_table("program_areas", conditions, (new_area_id, pa_id), msg)
    except:
        # request.form['area_title'] does not exist
        flash("No changes made to area relationship.") 
    
    return redirect(url_for('manage_areas'))

# edit an area
@app.route('/edit_area', methods=["POST", 'PUT']) # type:ignore
def edit_area():
    
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('editing area')
    
    area_id = request.form['area_list']
    new_area_title = request.form['new_area_title']
    
    print('area_id:', area_id)
    print('new title:', new_area_title)
    
    conditions = "area_title=%s WHERE area_id=%s"
    msg = "Area name has been changed to '{}'"
    
    update_table('areas', conditions, (new_area_title, area_id), msg, 1)
    
    return redirect(url_for("manage_areas"))

# delete an area connection to a program
@app.route('/delete_program_area/<string:pa_id>', methods = ['GET', 'DELETE']) # type:ignore
def delete_program_area(pa_id):

    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('deleting program-area relation...')
    
    conditions = "pa_id=%s"
    msg = "Connection between program and area at id {} was successfully deleted"
    
    # remove from program_areas
    remove_from_table("program_areas", conditions, (pa_id), msg)
    return redirect(url_for('manage_areas'))

# delete area (and all connections to all programs)
@app.route('/delete_area/<string:area_id>', methods= ['GET', 'DELETE']) # type:ignore
def delete_area(area_id):
    
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_admin()
    
    print('deleting area...')
    
    conditions = "area_id=%s"
    # remove from program_areas (since area_id is a foreign key)
    remove_from_table(table="program_areas", query_conditions=conditions, data=(area_id), should_flash=False)
    flash(f"All program connections to area with id '{area_id}' have been successfully deleted.")
    
    # remove from areas (no foreign key relations remain ^^)
    msg = "Area with id '{}' has been deleted."
    remove_from_table("areas", conditions, (area_id), msg)
    return redirect(url_for('manage_areas'))


# bug report stuff -----------------------------------------------

# bugReport.html ------------------------------
@app.route('/add_bug', methods=['GET', 'POST']) # type:ignore
def add_bug():
    
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_user()
    
    # posting a new report
    if request.method == 'POST':
        
        print('submitting a new bug report...')
        print(request.form)
        
        program_id = request.form.get('program_id')
        report_type = request.form.get('report_type')
        severity = request.form.get('severity')
        reproducible = request.form.get('reproducible')       
        problem_summary = request.form.get('problem_summary')
        problem = request.form.get('problem')
        suggested_fix = request.form.get("suggested_fix") 
        reporter_id = request.form.get('reported_by')
        date_reported = request.form.get('date_reported')   
        
        # reproducible has two states: "on" and "None"
        if reproducible == "on":
            reproducible = True
        else:
            reproducible = False
        
        # no suggestions could be given
        if suggested_fix == "":
            suggested_fix = "None given"
        
        # Get the file attachment from the form
        attachments = request.files.getlist('file')
        
        # check filename of the first file and empty file content
        is_length_one     = len(attachments) == 1
        has_empty_filename = attachments[0].filename == ''
        has_empty_content  = attachments[0].read() == b'' 
        
        # above conditions answer if there are any attachments
        has_attachments = True
        if is_length_one and has_empty_filename and has_empty_content:
            # the filename is empty (and file.read() will also be empty())
            has_attachments = False
        
        with pymysql.connect(**db_config) as connection:
            with connection.cursor() as cursor:
            
                # 1. make bug
                sql  = "INSERT INTO bugs (program_id, bug_type, bug_severity, bug_title, bug_description, bug_suggestion, bug_reproducible, user_reporter_id, bug_find_date) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
                data = (program_id, report_type, severity, problem_summary, problem, suggested_fix, reproducible, reporter_id, date_reported)
                cursor.execute(sql, data)
                connection.commit()
                bug_id= cursor.lastrowid
                
                flash(f"Bug report with id '{bug_id}' was successfully added.")
                
                # 2. add attachments (if any)
                if has_attachments:            
                    sql = "INSERT INTO attachments (attach_name, attach_content, bug_id) VALUES (%s, %s, %s)"
                    for attachment in attachments:
                        data = (attachment.filename, attachment.read(), bug_id)
                        cursor.execute(sql, data)
                        connection.commit()
                        flash(f"Attachment '{attachment.filename}' was successfully uploaded.")
                        
        # redirect to homepage
        return redirect(url_for('homepage'))


    # general landing
    sql_list = ['SELECT * FROM programs', 'SELECT * FROM areas', 'SELECT * FROM users']
    programs, areas, employees = get_all_table_results(sql_list)
    
    # if the request method is GET, render the add_bug page with the necessary form data
    report_types, severities, _, _, _, _ = set_static_report_values()
    # note: priority, status, resolution, resolution_version are UNUSED when making a new bug report

    print('making a bug report?')
    return render_template('bugReport.html', programs=programs, report_types=report_types, severities=severities, employees=employees, areas=areas, username=username, userlevel=userlevel)


# searchBug ------------------------------
@app.route('/search_bug', methods=['GET', 'POST']) # type:ignore
def search_bug():
    
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_user()

    if request.method == 'POST':
    
        sql_list = ['SELECT * FROM programs',
                    'SELECT * FROM areas',
                    'SELECT * FROM users']
        
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
        programs, areas, employees, search_result = get_all_table_results(sql_list)

        # if the request method is GET, render the add_bug page with the necessary form data
        report_types, severities, priority, status, resolution, resolution_version = set_static_report_values()
       
        # process the form data and store it in the database using PL/SQL
        
        # redirect to a success page
        return render_template('searchReport.html', is_initial=False)

    return render_template('searchReport.html', is_initial=True)


# TODO: revise the following routes, and related html templates
# updateBug.html --------------------------------
@app.route('/update_bug') # type:ignore
def update_bug():

    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_user()
    
    sql_list = ['SELECT * FROM bugs', 'SELECT * FROM programs', 'SELECT * FROM areas', 'SELECT * FROM users']

    data, programs, areas, employees = get_all_table_results(sql_list)
    print(data)

    report_types, severities, priority, status, resolution, resolution_version = set_static_report_values()
    
    return render_template('editBug.html',username=username,userlevel=userlevel, bugs=data, programs=programs, report_types=report_types, severities=severities, employees=employees, areas=areas, resolution=resolution, resolution_version=resolution_version, priority=priority, status=status)

# delete a bug
@app.route('/delete_bug/<string:id_data>', methods = ['GET'])
def delete_bug(id_data):

    verify_admin()
    
    with pymysql.connect(**db_config) as connection:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM bug WHERE bug_id=%s", (id_data,))
            
            connection.commit()
            message=f"Bug with id {id_data} was successfully deleted"
        
            flash(message=message)
            return redirect(url_for('update_bug'))

# edit a bug
@app.route('/edit_bug', methods=['POST','GET']) # type:ignore
def edit_bug():
    
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_user()
    
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


# view attachments
@app.route("/view_attachment/<string:filename>") # type:ignore
def view_attachment(filename):
    
    try:
        userlevel= session['user_level']
        username = session['username']
    except:
        return verify_user()
    
    connection = pymysql.connect(**db_config)
    with connection.cursor() as cursor:
        cursor.execute("SELECT attachment FROM bug WHERE filename = %s", (filename,))
        data = cursor.fetchone()
        print(data)
        
    return send_file(BytesIO(data['attachment']), attachment_filename=filename, as_attachment=True) #type:ignore
       

# automatic
if __name__ == "__main__":
    app.run(debug=debugVal, host='localhost', )
