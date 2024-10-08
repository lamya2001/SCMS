const API_URL = 'http://localhost:8500/api/v1';

//get request 

export const fetchAllCurrentRequests = async () => {
    const response = await fetch(`${API_URL}/rawMaterialCurrentRequest`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data; // إعادة جميع البيانات
};

export const fetchAllPreviousRequests = async () => {
    const response = await fetch(`${API_URL}/rawMaterialPreviousRequest`);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const json = await response.json();
    return json.data; // إعادة جميع البيانات
};

// change status
export const updateRawMaterialRequestStatus = async (id, newStatus) => {
    try {
        const response = await fetch(`${API_URL}/rawMaterialCurrentRequest/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus }) // إرسال الحالة الجديدة
        });

        if (!response.ok) {
            throw new Error('Failed to update the status');
        }

        return await response.json(); // استلام الرد
    } catch (error) {
        console.error("Error updating the status:", error);
        throw error; // إعادة الخطأ ليتسنى التعامل معه في مكان آخر
    }
};

export const deleteCurrentRequestById = async (id) => {
    const response = await fetch(`${API_URL}/rawMaterialCurrentRequest/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(`Error deleting current request: ${response.status}`);
    }
    // إذا كانت الاستجابة 204، فلا تحاول قراءة JSON

    if (response.status !== 204) {
        const data = await response.json(); // فقط حاول قراءة JSON إذا لم تكن الاستجابة 204
        return data; // استلام الرد بعد الحذف
    }

    return { msg: 'Request deleted successfully' }; // رد مناسب عند الحذف بنجاح بدون محتوى
};

//search current by id
export const searchCurrentRequestById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/rawMaterialCurrentRequest/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                // console.warn(`Request with ID ${id} not found.`);
                return null; // إعادة null في حالة عدم العثور على البيانات
            }
            throw new Error(`Error: ${response.status}`);
        }
        const json = await response.json();
        return json.data; // إعادة البيانات المستردة
    } catch (error) {
        console.error(`Failed to fetch current request: ${error.message}`);
        throw error; // إرسال الخطأ لمزيد من المعالجة في حالة وجود مشكلة أخرى
    }
};

//search current by manufacturer name
export const searchCurrentRequestByMName = async (MName) => {
    try {
        const response = await fetch(`${API_URL}/rawMaterialCurrentRequest/manufacturerName/${MName}`);
        if (!response.ok) {
            if (response.status === 404) {
                // console.warn(`Request with ID ${id} not found.`);
                return null; // إعادة null في حالة عدم العثور على البيانات
            }
            throw new Error(`Error: ${response.status}`);
        }
        const json = await response.json();
        return json.data; // إعادة البيانات المستردة
    } catch (error) {
        console.error(`Failed to fetch current request: ${error.message}`);
        throw error; // إرسال الخطأ لمزيد من المعالجة في حالة وجود مشكلة أخرى
    }
};

//search Previous by id
export const searchPreviousRequestById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/rawMaterialPreviousRequest/${id}`);
        if (!response.ok) {
            if (response.status === 404) {
                return null; // إعادة null في حالة عدم العثور على البيانات
            }
            throw new Error(`Error: ${response.status}`);
        }
        const json = await response.json();
        return json.data; // إعادة البيانات المستردة
    } catch (error) {
        console.error(`Failed to fetch previous request: ${error.message}`);
        throw error; // إرسال الخطأ لمزيد من المعالجة في حالة وجود مشكلة أخرى
    }
};

//search Previous by manufacturer name
export const searchPreviousRequestByMName = async (MName) => {
    try {
        const response = await fetch(`${API_URL}/rawMaterialPreviousRequest/manufacturerName/${MName}`);
        if (!response.ok) {
            if (response.status === 404) {
                // console.warn(`Request with ID ${id} not found.`);
                return null; // إعادة null في حالة عدم العثور على البيانات
            }
            throw new Error(`Error: ${response.status}`);
        }
        const json = await response.json();
        return json.data; // إعادة البيانات المستردة
    } catch (error) {
        console.error(`Failed to fetch Previous request: ${error.message}`);
        throw error; // إرسال الخطأ لمزيد من المعالجة في حالة وجود مشكلة أخرى
    }
};

//move currnt request to preveious request
export const moveCurrentToPrevious = async (id) => {

    try {
        // الخطوة الثانية: جلب الطلب من الطلبات الحالية
        const currentRequest = await searchCurrentRequestById(id);

        // الخطوة الثالثة: إرسال الطلب إلى قائمة الطلبات السابقة
        const response = await fetch(`${API_URL}/rawMaterialPreviousRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentRequest) // إرسال الطلب كما هو
        });

        if (!response.ok) {
            throw new Error(`Error moving request to previous: ${response.status}`);
        }

        // الخطوة الرابعة: حذف الطلب من قائمة الطلبات الحالية (اختياري إذا كان نقل وليس نسخ)
        await deleteCurrentRequestById(id);

        return await response.json(); // إرجاع الرد
    } catch (error) {
        console.error("Error moving request to previous:", error);
        throw error; // إعادة الخطأ ليتسنى التعامل معه في مكان آخر
    }
};



