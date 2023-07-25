let addEmployeeModal = $("#addEmployeeModal");
let editEmployeeModal = $("#editEmployeeModal");
let addDepartmentModal = $("#addDepartmentModal");
let editDepartmentModal = $("#editDepartmentModal");
let addLocationModal = $("#addLocationModal");
let editLocationModal = $("#editLocationModal");


$(window).on("load", function () {
  const preloader = document.getElementById("preloader3");
  preloader.style.display = "none";
  getAllEmployees();
  getAllDepartments();
  getAllLocations();
})


/*********************** LOCATIONS ***********************/

// GET ALL LOCATIONS
const getAllLocations = () => {
  const locationsContainer = $('#location-cards');

  $.ajax({
    url: 'libs/php/getAllLocations.php',
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      const locations = result.data;
      //console.log('Result locations:', locations);

      let addEmployeeLocationSelect = $("#addEmployeeLocationSelect");
      addEmployeeLocationSelect.html("");

      let editEmployeeLocationSelect = $("#editEmployeeLocationSelect");
      editEmployeeLocationSelect.html("");

      let addDepartmentLocationSelect = $("#addDepartmentLocationSelect");
      addDepartmentLocationSelect.html("");

      let editDepartmentLocationSelect = $("#editDepartmentLocationSelect");
      editDepartmentLocationSelect.html("");

      locationsContainer.empty(); // Clear existing location cards

      locations.forEach(function (singleLocation) {
        const locationName = singleLocation.name;
        const locationID = singleLocation.id;

        const displayLocations =
          `
          <div class="col mb-4">
            <div class="card bg-info-light bg-gradient">
              <div class="card-body">
                <h5 class="card-title">${locationName}</h5>
                <div class="d-flex align-items-center justify-content-between">

                  <button class="btn btn-tertiary editLocationIcon" type="button" data-id="${locationID}" data-name="${locationName}">
                    <i class='fa fa-solid fa-pencil fa-xl text-primary' title="Edit"></i>
                  </button>

                  <button class="btn btn-tertiary deleteLocationIcon" type="button" data-id="${locationID}">
                    <i class='fa fa-solid fa-trash fa-xl text-danger' title="Delete"></i>
                  </button>

                </div>
              </div>
            </div>
          </div> 
          `;

        locationsContainer.append(displayLocations);

        addEmployeeLocationSelect.append($(`<option value="${locationID}">${locationName}</option>`));
        editEmployeeLocationSelect.append($(`<option value="${locationID}">${locationName}</option>`));

        addDepartmentLocationSelect.append($(`<option value="${locationID}">${locationName}</option>`));
        editDepartmentLocationSelect.append($(`<option value="${locationID}">${locationName}</option>`));

      });
      addEmployeeLocationSelect.prepend($(`<option selected disabled value="0"></option>`));
      editEmployeeLocationSelect.prepend($(`<option value="0"></option>`));

      addDepartmentLocationSelect.prepend($(`<option selected disabled value="0">Select Location</option>`));

      // Edit Location Icon
      $(".editLocationIcon").on("click", function () {
        let id = $(this).attr("data-id");
        let name = $(this).attr("data-name");

        $("#id_ul").val(id);
        $("#locationName_u").val(name);
        $("#checkConfirmEditLocation").prop('checked', false);
        editLocationModal.modal("show");
      })

      // Delete Location Icon
      $(".deleteLocationIcon").on("click", function () {
        let id = $(this).attr("data-id");
        handleDeleteLocation(id);
        $("#id_dl").val(id);
      });

    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX Error:', errorThrown);
      console.log('Result:', jqXHR.responseText);
    },
  });
};



// ADD Location
$("#add-location").click(function () {
  addLocationModal.modal("show");
  resetModal(addLocationModal);
});

$(document).on("submit", "#addLocationForm", function (e) {
  e.preventDefault();

  $.ajax({
    url: "libs/php/insertLocation.php",
    type: 'POST',
    dataType: 'json',
    data: {
      name: toTitleCase($("#locationName_addl").val()),
    },
    success: function (result) {
      if (result.status.code == 200) {
        addLocationModal.modal("hide");
        getAllLocations();
      } else {
        console.log('Error while add location');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR, textStatus, errorThrown);
    }
  });
})

// EDIT - UPDATE Location
$(document).on("submit", "#editLocationForm", function (e) {
  e.preventDefault();

  $.ajax({
    url: "libs/php/updateLocation.php",
    type: 'POST',
    dataType: 'json',
    data: {
      name: toTitleCase($("#locationName_u").val()),
      id: $("#id_ul").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        editLocationModal.modal("hide");
        getAllLocations();
      } else {
        editLocationModal.modal("hide");
        getAllLocations;
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR, textStatus, errorThrown);
    }
  });
});

// Check if location has dependencies
const handleDeleteLocation = function (id) {
  $.ajax({
    url: 'libs/php/checkLocationUse.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: id
    },
    success: function (result) {
      if (result.status.code == 200) {
        if (result.data.departmentCount == 0) {
          $('#deleteLocationModal').modal('show');
        } else {
          $('#departmentCount').text(result.data.departmentCount);
          $('#forbiddenLocationModal').modal('show');
        }
      } else {
        $('.modalBody #deleteLocationForm').replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX Error:', errorThrown);
      console.log('Result:', jqXHR.responseText);
    }
  });
};


// DELETE Location
$("#deleteLocationModal").on("hidden.bs.modal", function () {
  $(this).find("form").trigger("reset");

});

$(document).on("submit", "#deleteLocationForm", function (e) {
  e.preventDefault();

  $.ajax({
    url: "libs/php/deleteLocationByID.php",
    type: 'POST',
    dataType: 'json',
    data: {
      id: $("#id_dl").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#deleteLocationModal").modal("hide");
        getAllLocations();
      } else {
        console.log("Error back-end");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR, textStatus, errorThrown);
    }
  });
});


/*********************** DEPARTMENTS ***********************/



// ADD Department
$("#add-department").click(function () {
  addDepartmentModal.modal("show");
  resetModal(addDepartmentModal);
});

$(document).on("submit", "#addDepartmentForm", function (e) {
  e.preventDefault();

  $.ajax({
    url: "libs/php/insertDepartment.php",
    type: 'POST',
    dataType: 'json',
    data: {
      name: toTitleCase($("#departmentName_a").val()),
      locationID: $("#addDepartmentLocationSelect :selected").val()
    },
    success: function (result) {

      if (result.status.name == "ok") {
        addDepartmentModal.modal("hide");
        getAllDepartments();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR, textStatus, errorThrown);
    }
  });
});


// EDIT - UPDATE Department
$(document).on("submit", "#editDepartmentForm", function (e) {
  e.preventDefault();

  $.ajax({
    url: "libs/php/updateDepartment.php",
    type: 'POST',
    dataType: 'json',
    data: {
      name: toTitleCase($("#departmentName_u").val()),
      locationID: $("#editDepartmentLocationSelect :selected").val(),
      id: $("#id_ud").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        editDepartmentModal.modal("hide");
        getAllDepartments();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR, textStatus, errorThrown);
    }
  });

});

// DELETE Department
$("#deleteDepartmentModal").on("hidden.bs.modal", function () {
  $(this).find("form").trigger("reset");
});

$(document).on("submit", "#deleteDepartmentForm", function (e) {
  e.preventDefault();

  $.ajax({
    url: "libs/php/deleteDepartmentByID.php",
    type: 'POST',
    dataType: 'json',
    data: {
      id: $("#id_dd").val()
    },
    success: function (result) {
      if (result.status.code == 200) {
        $("#deleteDepartmentModal").modal("hide");
        getAllDepartments();
      } else {
        console.log('Error result:', result);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR, textStatus, errorThrown);
    }
  });
});



// Check if department has dependencies
const handleDeleteDepartment = function (id) {
  $.ajax({
    url: 'libs/php/checkDepartmentUse.php',
    type: 'POST',
    dataType: 'json',
    data: {
      id: id
    },
    success: function (result) {
      if (result.status.code == 200) {
        if (result.data.departmentCount == 0) {
          $("#deleteDepartmentModal").modal("show");
        } else {
          $('#cantDeleteDeptName').text(result.data.departmentName);
          $('#personnelCount').text(result.data.departmentCount);
          $('#forbiddenDepartmentModal').modal("show");
        }
      } else {
        $('.modalBody #deleteDepartmentForm').replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX Error:', errorThrown);
      console.log('Result:', jqXHR.responseText);
    }
  });
};

// GET ALL DEPARTMENTS
const getAllDepartments = () => {
  const departmentsContainer = $('#department-cards');

  $.ajax({
    url: 'libs/php/getAllDepartments.php',
    type: 'GET',
    dataType: 'json',

    success: function (result) {
      const departments = result.data;
      //console.log('Result departments:', departments);

      let addEmployeeDepartmentSelect = $("#addEmployeeDepartmentSelect");
      addEmployeeDepartmentSelect.html("");

      departmentsContainer.empty(); // Clear existing department cards

      departments.forEach(function (department) {
        const departmentName = department.name;
        const departmentID = department.id;
        const departmentlocationID = department.locationID;
        const departmentLocName = department.location;

        const displayDepartments =
          `
          <div class="col mb-4">
            <div class="card card-hover bg-secondary-light bg-gradient">
              <div class="card-body">
                <h5 class="card-title">${departmentName}</h5>
                <div class="d-flex align-items-center justify-content-between">
                  <button class="btn btn-tertiary updateDepartmentIcon" type="button"
                    data-departmentid="${departmentID}"
                    data-name="${departmentName}"
                    data-location="${departmentLocName}"
                    data-locationID="${departmentlocationID}">
                    <i class='fa fa-solid fa-pencil fa-xl text-primary' title="Edit"></i>
                  </button>
                  <button class="btn btn-tertiary deleteDepartmentIcon" type="button" data-departmentid="${departmentID}">
                    <i class='fa fa-solid fa-trash fa-xl text-danger' title="Delete"></i>
                  </button>
                </div>  
              </div>
            </div>    
          </div>
          `;

        departmentsContainer.append(displayDepartments);

        addEmployeeDepartmentSelect.append($(`<option data-departmentid="${departmentID}" value="${departmentlocationID}">${departmentName}</option>`));
      });

      addEmployeeDepartmentSelect.prepend($(`<option selected disabled value="0">Select a Department</option>`));

      // Edit Department Button
      $(".updateDepartmentIcon").on("click", function () {
        let id = $(this).attr("data-departmentid");
        let name = $(this).attr("data-name");
        let locationID = $(this).attr("data-locationID");

        $("#id_ud").val(id);
        $("#departmentName_u").val(name);
        $("#editDepartmentLocationSelect").val(locationID);
        $('#checkConfirmEditDepartment').prop('checked', false);
        editDepartmentModal.modal("show");
      });

      // Delete Department Button
      $(".deleteDepartmentIcon").on("click", function () {
        let id = $(this).attr("data-departmentid");
        $("#id_dd").val(id);
        handleDeleteDepartment(id);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX Error:', errorThrown);
      console.log('Result:', jqXHR.responseText);
    },
  });
};


/*********************** EMPLOYEES ***********************/

const getAllEmployees = () => {
  const preloader = $('#preloader1');
  const employeesContainer = $('#employeesEntries');

  $.ajax({
    url: 'libs/php/getAll.php',
    type: 'GET',
    dataType: 'json',
    beforeSend: function () {
      preloader.show();
    },

    success: function (result) {
      //console.log('Result employees:', result.data);
      const employees = result.data;

      let totalEntries = $("#total-entries");

      employeesContainer.empty(); // Clear existing employee entries

      if (employees.length > 0) {
        for (let i = 0; i < employees.length; i++) {
          const firstName = employees[i].firstName;
          const lastName = employees[i].lastName;
          const empID = employees[i].id;

          const displayEmployees = `
            <tr data-id="${empID}">
              <td>${firstName}</td>
              <td>${lastName}</td>
            </tr>
          `;
          employeesContainer.append(displayEmployees);
        }

        const totalRows = $("#employeesEntries tr:visible").length;
        totalEntries.html($(`<h6 class="text-muted">${totalRows} employees</h6>`));

      } else {
        const noEmployees = `<tr><td colspan="2">There are no employees registered.</td></tr>`;
        employeesContainer.append(noEmployees);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX Error:', errorThrown);
      console.log('Result:', jqXHR.responseText);
    },
    complete: function () {
      setTimeout(function () {
        preloader.hide();
      }, 500)
    }
  });
};


// Get employee details
const getPersonnelByID = (id) => {
  const preloader = $('#preloader2');

  $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: 'POST',
    dataType: 'json',
    data: {
      id: id
    },
    beforeSend: function () {
      preloader.show();
    },

    success: function (result) {
      var resultCode = result.status.code;
      //console.log(result.data);
      if (resultCode == 200) {
        let employee = result.data.personnel[0];
        $('#employeeModalBody').removeClass("d-none")

        // Details 
        $('#employeeID').val(employee.id);
        $('#firstNameDetails').val(employee.firstName);
        $('#lastNameDetails').val(employee.lastName);
        $('#emailDetails').val(employee.email);
        $('#jobTitleDetails').val(employee.jobTitle);
        $('#departmentDetails').val(employee.departmentName);
        $('#locationDetails').val(employee.locationName);

        // Edit Employee Button
        $('#edit-employee-pencil').on('click', function () {
          editEmployeeModal.modal("show");
          $('#checkEditEmployee').prop('checked', false);

          // Input values
          $('#id_u').val(employee.id);
          $('#firstName_u').val(employee.firstName);
          $('#lastName_u').val(employee.lastName);
          $('#jobTitle_u').val(employee.jobTitle);
          $('#email_u').val(employee.email);

          // Edit Employee Departments select
          $('#editEmployeeDepartmentSelect').html('');
          $.each(result.data.department, function () {
            $('#editEmployeeDepartmentSelect').append($('<option>', {
              value: this.id,
              text: this.name,
            }));
          })
          $('#editEmployeeDepartmentSelect').val(result.data.personnel[0].departmentID);
        })

        // Bin delete button
        $('#edit-employee-bin').on('click', function () {
          $("#deleteEmployeeModal").modal("show");
          $('#id_u').val(employee.id);
        })

      } else {
        $('#details-title').replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('AJAX Error:', errorThrown);
      console.log('Result:', jqXHR.responseText);
    },
    complete: function () {
      setTimeout(function () {
        preloader.hide();
      }, 300)
    }
  });
};


// ========== Employees CREATE, UPDATE and DELETE ==========

// Add Employee
$(document).ready(function () {
  $("#add-employee").click(function () {
    addEmployeeModal.modal("show");
    resetModal(addEmployeeModal);
  });

  $(document).on("submit", "#addEmployeeForm", function (e) {
    e.preventDefault();

    $.ajax({
      url: "libs/php/insertPersonnel.php",
      type: 'POST',
      dataType: 'json',
      data: {
        firstName: toTitleCase($("#firstName_a").val()),
        lastName: toTitleCase($("#lastName_a").val()),
        jobTitle: toTitleCase($("#jobTitle_a").val()),
        email: $("#email_a").val().toLowerCase(),
        departmentID: $("#addEmployeeDepartmentSelect :selected").attr("data-departmentid")
      },
      success: function (result) {
        if (result.status.code == 200) {
          addEmployeeModal.modal("hide");
          location.reload();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
      }
    });
  });

  // Routine for dependent select options of Add Employee Form
  $("#addEmployeeDepartmentSelect").change(function () {
    $("#addEmployeeLocationSelect option").hide();
    $("#addEmployeeLocationSelect option[value='" + $(this).val() + "']").show();

    if ($("#addEmployeeLocationSelect option[value='" + $(this).val() + "']").length) {
      $("#addEmployeeLocationSelect option[value='" + $(this).val() + "']").first().prop("selected", true);
    }
    else {
      $("#addEmployeeLocationSelect").val("");
    }
  });

  // UPDATE Employee
  $("#editEmployeeForm").on("submit", function (e) {
    e.preventDefault();

    $.ajax({
      url: "libs/php/updatePersonnel.php",
      type: 'POST',
      dataType: 'json',
      data: {
        id: $("#id_u").val(),
        firstName: toTitleCase($("#firstName_u").val()),
        lastName: toTitleCase($("#lastName_u").val()),
        jobTitle: toTitleCase($("#jobTitle_u").val()),
        email: $("#email_u").val().toLowerCase(),
        departmentID: $("#editEmployeeDepartmentSelect :selected").val()
      },
      success: function (result) {
        //console.log(result.status.name);
        if (result.status.code == 200) {
          editEmployeeModal.modal("hide");
          location.reload();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
      }
    });
  });

  // Routine for dependent select options of Edit Employee Form
  $("#editEmployeeDepartmentSelect").change(function () {
    $("#editEmployeeLocationSelect option").hide();
    $("#editEmployeeLocationSelect option[value='" + $(this).val() + "']").show();

    if ($("#editEmployeeLocationSelect option[value='" + $(this).val() + "']").length) {
      $("#editEmployeeLocationSelect option[value='" + $(this).val() + "']").first().prop("selected", true);
    }
    else {
      $("#editEmployeeLocationSelect").val("");
    }
  });


  // DELETE Employee 
  $("#deleteEmployeeModal").on("hidden.bs.modal", function () {
    $(this).find("form").trigger("reset");
  });

  $("#deleteEmployeeForm").on("submit", function (e) {
    e.preventDefault();

    $.ajax({
      url: "libs/php/deletePersonnelByID.php",
      type: 'POST',
      dataType: 'json',
      data: {
        id: $("#id_u").val()
      },
      success: function (result) {
        if (result.status.code == 200) {
          $('#deleteEmployeeModal').modal("hide");
          location.reload();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
      }
    });
  });
})


// ============= OTHER EVENT HANDLERS =============

$(document).ready(function () {

  // Click event handler to select an employee and display their details
  $(document).on('click', '#employeesEntries tr', function () {
    let id = $(this).data("id");
    getPersonnelByID(id);

    $('#employeeModal p').addClass('d-none');
    $('#close-employee-details').removeClass('d-none');

    // (responsive) Scroll to the employee details section after a delay
    setTimeout(function () {
      let employeeDetailsSection = $("#redirect-details");
      let scrollPosition = employeeDetailsSection.offset().top + employeeDetailsSection.outerHeight() - $(window).height();

      $('html, body').animate({
        scrollTop: scrollPosition
      }, 200);
    }, 250);
  });

  // Close Employee Details
  $('#close-employee-details').on('click', function () {
    $('#employeeModal p').removeClass('d-none');
    $('#employeeModalBody').addClass('d-none');
    $('#close-employee-details').addClass('d-none');
  });

  // ======= SideBar Event Handlers =======

  // Event listener for Employees link
  $('#employeesLink').on('click', function () {
    $("#departmentsSection, #locationsSection").addClass("d-none");
    $("#employeesSection").removeClass("d-none");
    getAllEmployees();

    $('#employeeModalBody').addClass('d-none');
    $('#close-employee-details').addClass('d-none');
    $('#employeeModal p').removeClass('d-none');

    $(".input-group").removeClass('d-none');

  });

  // Event listener for Departments link
  $('#departmentsLink').on('click', function () {
    $("#employeesSection, #locationsSection").addClass("d-none");
    $("#departmentsSection").removeClass("d-none");
    $(".input-group").addClass('d-none');
  });

  // Event listener for Locations link
  $('#locationsLink').on('click', function () {
    $("#employeesSection, #departmentsSection").addClass("d-none");
    $("#locationsSection").removeClass("d-none");
    $(".input-group").addClass('d-none');
  });


  // Search Input - Employees Page
  $("#search-input").on("keyup", function () {
    let rows = $("#employeesEntries tr");
    let val = $.trim($(this).val()).replace(/ +/g, " ").toLowerCase();

    rows.show().filter(function () {
      var text = $(this).text().replace(/\s+/g, " ").toLowerCase();
      return !~text.indexOf(val);
    }).hide();
    let totalEntries = $("#total-entries");
    let totalRows = $("#employeesEntries tr:visible").length;
    if (totalRows == 1) {
      totalEntries.html($(`<h6 class="text-muted">${totalRows} employee</h6>`));
    } else {
      totalEntries.html($(`<h6 class="text-muted">${totalRows} employees</h6>`));
    }
  });
});


// ======= FUNCTIONALITIES =======

// Capitalize first letters
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Resets Modal
function resetModal(modalName) {
  modalName.on("hidden.bs.modal", function () {
    $(this).find("form").trigger("reset");
  })
}

// JavaScript to handle sidebar collapse on link click
$(".list-group-item").on("click", function () {
  // Collapse the sidebar manually
  $("#sidebarMenu").collapse("hide");
});


/*
// Periodically updating the employee list
const pollForEmployeeUpdates = () => {
  getAllEmployees(); // Get the latest employee data

  // Poll for updates every 5 seconds (adjust as needed)
  setTimeout(pollForEmployeeUpdates, 5000);
};

// Start polling for updates when the page is ready
$(document).ready(function () {
  pollForEmployeeUpdates();
});
*/