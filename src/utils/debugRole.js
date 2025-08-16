// Debug utility untuk testing role assignment
import { isDefaultAdmin, ROLES, DEFAULT_ADMIN_EMAILS } from './roleUtils';

export const debugRoleAssignment = (email) => {
  console.log('=== DEBUG ROLE ASSIGNMENT ===');
  console.log('Email input:', email);
  console.log('Email lowercase:', email?.toLowerCase());
  console.log('Admin emails list:', DEFAULT_ADMIN_EMAILS);
  console.log('Is default admin?', isDefaultAdmin(email));
  console.log('Expected role:', isDefaultAdmin(email) ? ROLES.ADMIN : ROLES.CUSTOMER);
  console.log('=============================');
  
  return isDefaultAdmin(email) ? ROLES.ADMIN : ROLES.CUSTOMER;
};

// Test specific emails
export const testEmails = () => {
  console.log('\n=== TESTING EMAILS ===');
  const testCases = [
    'admin@darknessmerch.com',
    'admin@gmail.com', 
    'admin!@gmail.com',
    'customer@test.com'
  ];
  
  testCases.forEach(email => {
    console.log(`${email} → ${debugRoleAssignment(email)}`);
  });
  console.log('=====================\n');
};
