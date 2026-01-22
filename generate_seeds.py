import random
import datetime
import os

def generate_mysql_data():
    sql = []
    
    # ---------------------------------------------------------
    # AUTH SERVICE (MySQL: auth_db)
    # ---------------------------------------------------------
    sql.append("USE auth_db;")
    sql.append("")
    
    departments = ["Informatique", "Mathématiques", "Physique", "Droit", "Economie", "Biologie", "Histoire", "Géographie", "Anglais", "Philosophie"]
    first_names = ["Mohamed", "Ahmed", "Fatima", "Aminata", "Ibrahim", "Moussa", "Aicha", "Zainab", "Oumar", "Abdoul", "Jean", "Paul", "Marie", "Sophie", "Pierre"]
    last_names = ["Ali", "Sani", "Mamane", "Abdou", "Issoufou", "Diallo", "Traore", "Maiga", "Diop", "Keita", "Sow", "Camara", "Konate", "Toure", "Cisse"]
    
    # Ahmed Admin User
    sql.append("-- Specific Admin Requested by User")
    # Password 'password' hashed
    sql.append("INSERT INTO users (username, email, password, first_name, last_name, role, enabled, department, phone_number, address) VALUES ('Ahmed', 'ahmedlaminouamadou@gmail.com', '$2y$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Ahmed', 'Laminou', 'ADMIN', true, 'Administration', '+227 00000000', 'Niamey');")

    # Generate 120 Students
    sql.append("\n-- Students (120)")
    student_ids = []
    for i in range(1, 121):
        username = f"etudiant{i}"
        email = f"etudiant{i}@university.ne"
        password = "$2y$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG"
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        dept = random.choice(departments)
        phone = f"+227 9{random.randint(0,9)}{random.randint(0,9)}{random.randint(0,9)}{random.randint(0,9)}{random.randint(0,9)}{random.randint(0,9)}{random.randint(0,9)}"
        address = "Niamey, Niger"
        
        sql.append(f"INSERT INTO users (username, email, password, first_name, last_name, role, enabled, department, phone_number, address) VALUES ('{username}', '{email}', '{password}', '{fname}', '{lname}', 'STUDENT', true, '{dept}', '{phone}', '{address}');")
        student_ids.append(i + 1) # 1 is Ahmed

    # Generate 25 Professors
    sql.append("\n-- Professors (25)")
    prof_ids = []
    for i in range(1, 26):
        username = f"prof{i}"
        email = f"prof{i}@university.ne"
        password = "$2y$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG"
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        dept = random.choice(departments)
        phone = f"+227 8{random.randint(0,9)}{random.randint(0,9)}{random.randint(0,9)}{random.randint(0,9)}{random.randint(0,9)}{random.randint(0,9)}{random.randint(0,9)}"

        sql.append(f"INSERT INTO users (username, email, password, first_name, last_name, role, enabled, department, phone_number, address) VALUES ('{username}', '{email}', '{password}', '{fname}', '{lname}', 'PROFESSOR', true, '{dept}', '{phone}', 'Université de Niamey');")
        prof_ids.append(i + 121)

    
    # ---------------------------------------------------------
    # COURSE SERVICE (MySQL: course_db)
    # ---------------------------------------------------------
    sql.append("\n\nUSE course_db;")

    # Generate 100 Courses
    courses = []
    course_codes = ["INF", "MATH", "PHYS", "BIO", "ECO", "HIST", "GEO", "ANG", "PHIL", "DROIT"]
    
    for i in range(1, 101):
        subject = random.choice(course_codes)
        code = f"{subject}{100 + i}"
        name = f"Cours de {subject} Niveau {i}"
        desc = f"Approfondissement du cours de {name}."
        credits = random.randint(2, 6)
        prof_id = random.choice(prof_ids)
        prof_name = f"Professeur {prof_id}"
        
        sql.append(f"INSERT INTO courses (code, name, description, credits, professor_id, professor_name, semester) VALUES ('{code}', '{name}', '{desc}', {credits}, '{prof_id}', '{prof_name}', 'S1-2024');")
        courses.append(i)

    # Generate Materials (100+)
    sql.append("\n-- Course Materials (150)")
    for i in range(1, 151):
        course_id = random.randint(1, 100)
        title = f"Ressource {i} - Cours {course_id}"
        sql.append(f"INSERT INTO course_materials (course_id, title, description, file_url, file_type) VALUES ({course_id}, '{title}', 'Support pédago', 'https://example.com/doc{i}.pdf', 'SLIDES');")

    # Generate Enrollments (300+)
    sql.append("\n-- Enrollments (400)")
    for i in range(1, 401):
        s_id = random.choice(student_ids)
        c_id = random.choice(courses)
        sql.append(f"INSERT INTO enrollments (course_id, student_id, status, enrolled_at) VALUES ({c_id}, '{s_id}', 'ENROLLED', NOW());")

    
    # ---------------------------------------------------------
    # BILLING SERVICE (MySQL: billing_db)
    # ---------------------------------------------------------
    sql.append("\n\nUSE billing_db;")

    # Generate Invoices (200+)
    sql.append("\n-- Invoices & Payments (200)")
    for i in range(1, 201):
        s_id = random.choice(student_ids)
        amount = random.choice([15000, 25000, 50000, 100000, 150000])
        status = random.choice(['paid', 'pending', 'overdue'])
        sql.append(f"INSERT INTO invoices (student_id, amount, description, due_date, status) VALUES ('{s_id}', {amount}, 'Frais académiques', '2024-12-31', '{status}');")
        
        if status == 'paid':
            sql.append(f"INSERT INTO payments (invoice_id, student_id, amount, payment_method, reference_number, paid_at) VALUES ({i}, '{s_id}', {amount}, 'MYNITA', 'TXN{random.randint(100000,999999)}', NOW());")

    return "\n".join(sql)

def generate_postgres_grade_data():
    sql = []
    sql.append("-- GRADE SERVICE (grade_db)")
    
    # 100+ Grades
    for i in range(1, 151):
        s_id = random.randint(2, 121)
        c_id = random.randint(1, 100)
        grade = round(random.uniform(7.0, 19.5), 2)
        sql.append(f"INSERT INTO grades (student_id, course_id, grade, grade_type, feedback, created_at) VALUES ('{s_id}', '{c_id}', {grade}, 'FINAL', 'Note validée', NOW());")

    # 100+ Attendance
    for i in range(1, 151):
        s_id = random.randint(2, 121)
        c_id = random.randint(1, 100)
        status = random.choice(['PRESENT', 'PRESENT', 'ABSENT'])
        sql.append(f"INSERT INTO attendance (student_id, course_id, session_date, status, remarks) VALUES ('{s_id}', '{c_id}', '2024-11-{random.randint(1,28):02d}', '{status}', '');")

    return "\n".join(sql)

def generate_postgres_payment_data():
    sql = []
    sql.append("-- PAYMENT SERVICE (payment_db)")
    
    # 100+ Transactions
    for i in range(1, 121):
        s_id = random.randint(2, 121)
        amount = random.choice([15000, 25000, 50000])
        method = random.choice(['mynita', 'bank_card', 'mobile_money'])
        status = 'SUCCESS'
        sql.append(f"INSERT INTO payments (student_id, amount, provider, status, transaction_id, created_at) VALUES ('{s_id}', {amount}, '{method}', '{status}', 'PAY-{random.randint(10000,99999)}', NOW());")
    
    return "\n".join(sql)

if __name__ == "__main__":
    os.makedirs("services/postgres-init", exist_ok=True)
    os.makedirs("services/postgres-payment-init", exist_ok=True)

    with open("services/mysql-init/z_seed.sql", "w", encoding="utf-8") as f:
        f.write(generate_mysql_data())
    
    with open("services/postgres-init/z_seed.sql", "w", encoding="utf-8") as f:
        f.write(generate_postgres_grade_data())

    with open("services/postgres-payment-init/z_seed.sql", "w", encoding="utf-8") as f:
        f.write(generate_postgres_payment_data())

    print("✅ Seed files generated in service init directories.")
