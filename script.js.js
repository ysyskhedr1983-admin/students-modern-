// Global data storage
let studentsData = [];
let scheduleData = [];

// ARABIC DAYS: السبت to الخميس
const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const lectures = [1, 2, 3, 4, 5, 6, 7];

// دالة لتحميل البيانات من localStorage
function loadDataFromStorage() {
    try {
        const savedData = localStorage.getItem('academyData');
        if (savedData) {
            const data = JSON.parse(savedData);
            studentsData = data.students || [];
            scheduleData = data.schedule || [];
            
            console.log('📊 تم تحميل البيانات:', {
                students: studentsData.length,
                schedule: scheduleData.length
            });
            
            return true;
        } else {
            console.log('❌ لا توجد بيانات محفوظة');
            return false;
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        return false;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeScheduleTable();
    
    // تحميل البيانات أولاً
    if (loadDataFromStorage()) {
        if (studentsData.length > 0) {
            showStatus(`✅ تم تحميل ${studentsData.length} طالب و ${scheduleData.length} مادة - أدخل رقم الطالب`, 'success');
        } else {
            showStatus('⚠️ لا توجد بيانات، استخدم نسخة المشرف أولاً', 'warning');
        }
    } else {
        showStatus('❌ لا توجد بيانات في النظام', 'error');
    }
});

// Create empty schedule table
function initializeScheduleTable() {
    const scheduleBody = document.getElementById('scheduleBody');
    scheduleBody.innerHTML = '';
    
    lectures.forEach(lecture => {
        const row = document.createElement('tr');
        
        const lectureCell = document.createElement('td');
        lectureCell.textContent = `محاضرة ${lecture}`;
        lectureCell.style.fontWeight = 'bold';
        row.appendChild(lectureCell);
        
        days.forEach(day => {
            const dayCell = document.createElement('td');
            dayCell.id = `cell-${day}-${lecture}`;
            dayCell.innerHTML = '<div style="color: #999; font-size: 11px;">لا يوجد حصة</div>';
            row.appendChild(dayCell);
        });
        
        scheduleBody.appendChild(row);
    });
}

// Search student function
function searchStudent() {
    const studentId = document.getElementById('studentId').value.trim();
    
    if (!studentId) {
        showStatus('❌ الرجاء إدخال الرقم الجامعي', 'error');
        return;
    }
    
    // تحميل البيانات أولاً للتأكد
    if (!loadDataFromStorage()) {
        showStatus('❌ لا توجد بيانات في النظام', 'error');
        return;
    }
    
    if (studentsData.length === 0) {
        showStatus('❌ لا توجد بيانات طلاب', 'error');
        return;
    }
    
    console.log('🔍 البحث عن رقم الطالب:', studentId);
    
    // Find student
    const student = studentsData.find(s => 
        s.id.toString().toLowerCase() === studentId.toLowerCase() || 
        s.id == studentId
    );
    
    if (!student) {
        showStatus(`❌ الرقم الجامعي ${studentId} غير مسجل`, 'error');
        return;
    }
    
    // Display student information
    displayStudentInfo(student);
    
    // Display schedule
    displayStudentSchedule(studentId);
    
    showStatus(`✅ تم تحميل جدول ${student.name}`, 'success');
}

// Display student information
function displayStudentInfo(student) {
    document.getElementById('displayStudentId').textContent = student.id;
    document.getElementById('displayStudentName').textContent = student.name;
    document.getElementById('displayStudentSpec').textContent = student.spec;
    document.getElementById('displaySectionNo').textContent = student.section;
    
    document.getElementById('studentInfo').style.display = 'block';
}

// Display student schedule
function displayStudentSchedule(studentId) {
    console.log('📅 عرض الجدول للطالب:', studentId);
    
    // Clear all cells first
    days.forEach(day => {
        lectures.forEach(lecture => {
            const cell = document.getElementById(`cell-${day}-${lecture}`);
            cell.innerHTML = '<div style="color: #999; font-size: 11px;">لا يوجد حصة</div>';
            cell.style.backgroundColor = '';
        });
    });
    
    // Find student's schedule
    const studentSchedule = scheduleData.filter(item => 
        item.id.toString().toLowerCase() === studentId.toLowerCase() || 
        item.id == studentId
    );
    
    console.log('المدخلات الموجودة في الجدول:', studentSchedule);
    
    if (studentSchedule.length === 0) {
        showStatus(`⚠️ لا يوجد جدول للطالب ${studentId}`, 'warning');
        return;
    }
    
    // Populate schedule
    studentSchedule.forEach(item => {
        const cell = document.getElementById(`cell-${item.d}-${item.l}`);
        if (cell) {
            const courseDiv = document.createElement('div');
            courseDiv.className = 'course-info';
            courseDiv.innerHTML = `
                <strong>${item.c}</strong>
                <div>👨‍🏫 ${item.p}</div>
                <div>🕐 ${item.t}</div>
            `;
            cell.innerHTML = '';
            cell.appendChild(courseDiv);
            cell.style.backgroundColor = '#e3f2fd';
        }
    });
    
    // Show the schedule table
    document.getElementById('scheduleTable').style.display = 'table';
}

// Show help information
function showHelp() {
    showStatus(
        `ℹ️ <strong>تعليمات الاستخدام:</strong><br>
        1. أدخل رقمك الجامعي كما هو مسجل في النظام<br>
        2. اضغط "عرض الجدول" لمشاهدة جدولك الكامل<br>
        3. إذا لم تظهر البيانات، تأكد من تحميلها في نسخة المشرف<br>
        4. للاستفسارات: <strong>شؤون الطلاب</strong>`,
        'success'
    );
}

// Show status messages
function showStatus(message, type) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.innerHTML = message;
    statusElement.className = `status ${type}`;
}

// Allow Enter key to search
document.getElementById('studentId').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchStudent();
    }
});

// Auto-focus on input
document.getElementById('studentId').focus();