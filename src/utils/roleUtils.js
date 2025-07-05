import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Default roles
export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
};

// Default admin emails (dapat dikonfigurasi)
export const DEFAULT_ADMIN_EMAILS = [
  'admin@darknessmerch.com',
  'admin@gmail.com',
  'admin!@gmail.com'
];

/**
 * Mengecek apakah email adalah admin default
 */
export const isDefaultAdmin = (email) => {
  return DEFAULT_ADMIN_EMAILS.includes(email?.toLowerCase());
};

/**
 * Mendapatkan role user dari Firestore
 */
export const getUserRole = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().role || ROLES.CUSTOMER;
    }
    return ROLES.CUSTOMER;
  } catch (error) {
    console.error('Error getting user role:', error);
    return ROLES.CUSTOMER;
  }
};

/**
 * Menyimpan atau mengupdate role user di Firestore
 */
export const setUserRole = async (userId, userEmail, role = null) => {
  try {
    // Debug logging
    console.log('🔍 setUserRole called with:', { userId, userEmail, role });
    
    // Selalu cek role admin dari daftar, override jika perlu
    const shouldBeAdmin = isDefaultAdmin(userEmail);
    const finalRole = role || (shouldBeAdmin ? ROLES.ADMIN : ROLES.CUSTOMER);
    
    console.log('🔍 Role check:', { 
      shouldBeAdmin, 
      finalRole, 
      adminEmails: DEFAULT_ADMIN_EMAILS,
      emailLower: userEmail?.toLowerCase()
    });

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    const userData = {
      email: userEmail,
      role: finalRole,
      updatedAt: new Date().toISOString()
    };

    // Jika user sudah ada dan role-nya berbeda dari yang seharusnya, update
    if (userDoc.exists()) {
      const currentRole = userDoc.data().role;
      console.log('🔍 Existing user role:', currentRole, '→ new role:', finalRole);
      
      if (currentRole !== finalRole) {
        await updateDoc(userRef, userData);
        console.log('✅ Role updated in Firestore');
      } else {
        console.log('ℹ️ Role unchanged, skipping update');
      }
    } else {
      // Create new user document
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date().toISOString()
      });
      console.log('✅ New user created in Firestore');
    }

    console.log('🎯 Final role returned:', finalRole);
    return finalRole;
  } catch (error) {
    console.error('❌ Error setting user role:', error);
    throw error;
  }
};

/**
 * Mengecek apakah user memiliki role admin
 */
export const isAdmin = (userRole) => {
  return userRole === ROLES.ADMIN;
};

/**
 * Mengecek apakah user memiliki role customer
 */
export const isCustomer = (userRole) => {
  return userRole === ROLES.CUSTOMER;
};

/**
 * Mendapatkan redirect path berdasarkan role
 */
export const getRedirectPath = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.CUSTOMER:
    default:
      return '/';
  }
};
