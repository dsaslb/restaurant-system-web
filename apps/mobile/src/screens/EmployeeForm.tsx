import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { trpc } from '@restaurant-system/trpc';

export default function EmployeeFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const employee = route.params?.employee;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
  });

  const createMutation = trpc.employee.create.useMutation({
    onSuccess: () => {
      Alert.alert('성공', '직원이 추가되었습니다.');
      navigation.goBack();
    },
  });

  const updateMutation = trpc.employee.update.useMutation({
    onSuccess: () => {
      Alert.alert('성공', '직원 정보가 수정되었습니다.');
      navigation.goBack();
    },
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        department: employee.department,
      });
    }
  }, [employee]);

  const handleSubmit = async () => {
    try {
      if (employee) {
        await updateMutation.mutateAsync({
          id: employee.id,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      Alert.alert('오류', '직원 정보 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>
          {employee ? '직원 정보 수정' : '직원 추가'}
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="이름을 입력하세요"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="이메일을 입력하세요"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>전화번호</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="전화번호를 입력하세요"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>직책</Text>
          <TextInput
            style={styles.input}
            value={formData.position}
            onChangeText={(text) => setFormData({ ...formData, position: text })}
            placeholder="직책을 입력하세요"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>부서</Text>
          <TextInput
            style={styles.input}
            value={formData.department}
            onChangeText={(text) => setFormData({ ...formData, department: text })}
            placeholder="부서를 입력하세요"
          />
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>
              {employee ? '수정' : '추가'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#9ca3af',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
}); 