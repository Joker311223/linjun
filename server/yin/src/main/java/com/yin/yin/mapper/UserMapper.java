package com.yin.yin.mapper;

import com.yin.yin.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户Mapper接口
 */
@Mapper
public interface UserMapper {
    /**
     * 根据用户名查询用户
     */
    User selectByUsername(String username);

    /**
     * 根据ID查询用户
     */
    User selectById(Long id);

    /**
     * 查询用户列表
     */
    List<User> selectList(@Param("keyword") String keyword,
                          @Param("status") Integer status,
                          @Param("startDate") String startDate,
                          @Param("endDate") String endDate,
                          @Param("offset") Integer offset,
                          @Param("limit") Integer limit);

    /**
     * 查询用户总数
     */
    Long selectCount(@Param("keyword") String keyword,
                    @Param("status") Integer status,
                    @Param("startDate") String startDate,
                    @Param("endDate") String endDate);

    /**
     * 插入用户
     */
    int insert(User user);

    /**
     * 更新用户
     */
    int update(User user);

    /**
     * 删除用户
     */
    int deleteById(Long id);

    /**
     * 更新用户最后登录时间
     */
    int updateLastLoginTime(@Param("id") Long id, @Param("lastLoginTime") String lastLoginTime);
}
